"""Prepare an accurate 2D Europe map from Natural Earth Admin 0 (public domain)."""
import hashlib
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INPUT = ROOT / "output/episodio-06-emergencia/revision-interna/natural-earth-110m.geojson"
OUTPUT = ROOT / "src/episodios/episodio-06-mochila-emergencia/europa.json"
EU = set("AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE".split())
LIMITS = (-27, 33, 47, 73)


def crop(ring):
    """Clip coastal polygons to the regional map bounds before projecting."""
    west, south, east, north = LIMITS
    for axis, edge, direction in [(0, west, 1), (0, east, -1), (1, south, 1), (1, north, -1)]:
        if not ring:
            return []
        result = []
        a = ring[-1]
        for b in ring:
            outside_a = direction * (a[axis] - edge) < 0
            outside_b = direction * (b[axis] - edge) < 0
            if outside_a != outside_b:
                fraction = (edge - a[axis]) / (b[axis] - a[axis])
                result.append(tuple(x + (y - x) * fraction for x, y in zip(a, b)))
            if not outside_b:
                result.append(b)
            a = b
        ring = result
    return ring


rad = math.radians
parallel1, parallel2 = rad(42), rad(65)
tan_pole = lambda lat: math.tan(math.pi / 4 + lat / 2)
n = math.log(math.cos(parallel1) / math.cos(parallel2)) / math.log(tan_pole(parallel2) / tan_pole(parallel1))
f = math.cos(parallel1) * tan_pole(parallel1) ** n / n
origin = f / tan_pole(rad(52)) ** n


def project(point):
    lon, lat = point
    radius = f / tan_pole(rad(lat)) ** n
    angle = n * rad(lon - 12)
    return radius * math.sin(angle), -(origin - radius * math.cos(angle))


def screen(point):
    x, y = project(point)
    return round(455 + x * 1220, 1), round(435 + y * 1220, 1)


def path_data(ring):
    points = [screen(point) for point in ring]
    return "M" + "L".join(f"{x},{y}" for x, y in points) + "Z"


raw = INPUT.read_bytes()
data = json.loads(raw)
countries = []
for feature in data["features"]:
    properties = feature["properties"]
    geometry = feature["geometry"]
    code = properties.get("ISO_A2_EH", properties.get("ISO_A2"))
    polygons = geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]
    rings = [crop(ring) for polygon in polygons for ring in polygon]
    paths = [path_data(ring) for ring in rings if len(ring) >= 3]
    if paths:
        countries.append(dict(code=code, name=properties["ADMIN"], eu=code in EU, path="".join(paths)))

# The public-domain 1:110m layer omits islands below its scale, including Malta.
if not any(country["code"] == "MT" for country in countries):
    x, y = screen((14.3754, 35.9375))
    countries.append(dict(code="MT", name="Malta", eu=True, path=f"M{x-2},{y}a2,2 0 1,0 4,0a2,2 0 1,0 -4,0Z"))
assert {country["code"] for country in countries if country["eu"]} == EU
OUTPUT.write_text(json.dumps({
    "source": "Natural Earth 1:110m Admin 0, v5.1.2 (public domain)",
    "sourceSha256": hashlib.sha256(raw).hexdigest(),
    "projection": "Lambert conformal conic",
    "sweden": screen((16, 62)),
    "countries": countries,
}, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
