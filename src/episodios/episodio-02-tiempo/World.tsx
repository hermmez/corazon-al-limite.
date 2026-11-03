import React from "react";
import { AbsoluteFill } from "remotion";
import {
  StoryScene0,
  StoryScene1,
  StoryScene2,
  StoryScene3,
} from "./StoryScenesA";
import {
  StoryScene4,
  StoryScene5,
  StoryScene6,
  StoryScene7,
} from "./StoryScenesB";

/** A single protagonist's day, composed in full-bleed spatial environments. */
export const StoryWorld: React.FC<{
  time: number;
  scene: number;
  action: number;
}> = ({ time, scene, action }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    {scene === 0 ? (
      <StoryScene0 time={time} action={action} />
    ) : scene === 1 ? (
      <StoryScene1 time={time} action={action} />
    ) : scene === 2 ? (
      <StoryScene2 time={time} action={action} />
    ) : scene === 3 ? (
      <StoryScene3 time={time} action={action} />
    ) : scene === 4 ? (
      <StoryScene4 time={time} action={action} />
    ) : scene === 5 ? (
      <StoryScene5 time={time} action={action} />
    ) : scene === 6 ? (
      <StoryScene6 time={time} action={action} />
    ) : (
      <StoryScene7 time={time} action={action} />
    )}
  </AbsoluteFill>
);
