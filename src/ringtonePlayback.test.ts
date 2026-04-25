/*
Copyright 2026 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE in the repository root for full details.
*/

import { describe, expect, test } from "vitest";

import { resolveRingtonePlayback } from "./ringtonePlayback";

describe("resolveRingtonePlayback", () => {
  test("keeps existing web volume when native config is unavailable", () => {
    expect(resolveRingtonePlayback(0.8)).toEqual({
      shouldPlay: true,
      volume: 0.8,
    });
  });

  test("disables playback when native config says ringtone should not play", () => {
    expect(
      resolveRingtonePlayback(0.8, {
        shouldPlay: false,
        volume: 1,
      }),
    ).toEqual({
      shouldPlay: false,
      volume: 0,
    });
  });

  test("scales playback volume by native ringtone volume", () => {
    expect(
      resolveRingtonePlayback(0.8, {
        shouldPlay: true,
        volume: 0.5,
      }),
    ).toEqual({
      shouldPlay: true,
      volume: 0.4,
    });
  });

  test("clamps invalid native volume values into the supported range", () => {
    expect(
      resolveRingtonePlayback(0.8, {
        shouldPlay: true,
        volume: 2,
      }),
    ).toEqual({
      shouldPlay: true,
      volume: 0.8,
    });
  });
});
