/*
Copyright 2022-2024 New Vector Ltd.
Copyright 2026 Element Creations Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE in the repository root for full details.
*/
import { type ComponentPropsWithoutRef, type FC } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Button as CpdButton, Tooltip } from "@vector-im/compound-web";
import {
  MicOnSolidIcon,
  MicOffSolidIcon,
  VideoCallSolidIcon,
  VideoCallOffSolidIcon,
  EndCallIcon,
  ShareScreenSolidIcon,
  SettingsSolidIcon,
  VoiceCallSolidIcon,
  VolumeOnSolidIcon,
} from "@vector-im/compound-design-tokens/assets/web/icons";

import styles from "./Button.module.css";

interface MicButtonProps extends ComponentPropsWithoutRef<"button"> {
  enabled: boolean;
  size?: "sm" | "lg";
}

export const MicButton: FC<MicButtonProps> = ({ enabled, ...props }) => {
  const { t } = useTranslation();
  const Icon = enabled ? MicOnSolidIcon : MicOffSolidIcon;
  const label = enabled
    ? t("mute_microphone_button_label")
    : t("unmute_microphone_button_label");

  return (
    <Tooltip label={label}>
      <CpdButton
        iconOnly
        aria-label={label}
        Icon={Icon}
        kind={enabled ? "primary" : "secondary"}
        {...props}
      />
    </Tooltip>
  );
};

interface VideoButtonProps extends ComponentPropsWithoutRef<"button"> {
  enabled: boolean;
  size?: "sm" | "lg";
}

export const VideoButton: FC<VideoButtonProps> = ({ enabled, ...props }) => {
  const { t } = useTranslation();
  const Icon = enabled ? VideoCallSolidIcon : VideoCallOffSolidIcon;
  const label = enabled
    ? t("stop_video_button_label")
    : t("start_video_button_label");

  return (
    <Tooltip label={label}>
      <CpdButton
        iconOnly
        aria-label={label}
        Icon={Icon}
        kind={enabled ? "primary" : "secondary"}
        {...props}
      />
    </Tooltip>
  );
};

interface ShareScreenButtonProps extends ComponentPropsWithoutRef<"button"> {
  enabled: boolean;
  size: "sm" | "lg";
}

export const ShareScreenButton: FC<ShareScreenButtonProps> = ({
  enabled,
  ...props
}) => {
  const { t } = useTranslation();
  const label = enabled
    ? t("stop_screenshare_button_label")
    : t("screenshare_button_label");

  return (
    <Tooltip label={label}>
      <CpdButton
        iconOnly
        Icon={ShareScreenSolidIcon}
        kind={enabled ? "primary" : "secondary"}
        {...props}
      />
    </Tooltip>
  );
};

interface EndCallButtonProps extends ComponentPropsWithoutRef<"button"> {
  size?: "sm" | "lg";
}

export const EndCallButton: FC<EndCallButtonProps> = ({
  className,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Tooltip label={t("hangup_button_label")}>
      <CpdButton
        className={classNames(className, styles.endCall)}
        iconOnly
        aria-label={t("hangup_button_label")}
        Icon={EndCallIcon}
        destructive
        {...props}
      />
    </Tooltip>
  );
};

interface SettingsButtonProps extends ComponentPropsWithoutRef<"button"> {
  size?: "sm" | "lg";
}
export const SettingsButton: FC<SettingsButtonProps> = (props) => {
  const { t } = useTranslation();

  return (
    <Tooltip label={t("common.settings")}>
      <CpdButton
        iconOnly
        Icon={SettingsSolidIcon}
        kind="secondary"
        {...props}
      />
    </Tooltip>
  );
};

interface AudioOutputButtonProps extends ComponentPropsWithoutRef<"button"> {
  targetOutput: "earpiece" | "speaker";
  size?: "sm" | "lg";
}

export const AudioOutputButton: FC<AudioOutputButtonProps> = ({
  targetOutput,
  ...props
}) => {
  const { t } = useTranslation();
  // targetOutput 表示点击按钮后要切换到的输出模式，所以按钮展示的是“下一步”的目标设备。
  const Icon = targetOutput === "earpiece" ? VoiceCallSolidIcon : VolumeOnSolidIcon;
  const label =
    targetOutput === "earpiece"
      ? t("settings.devices.handset")
      : t("settings.devices.loudspeaker");

  return (
    <Tooltip label={label}>
      <CpdButton
        iconOnly
        aria-label={label}
        Icon={Icon}
        kind="secondary"
        {...props}
      />
    </Tooltip>
  );
};
