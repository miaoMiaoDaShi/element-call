/*
Copyright 2022-2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE in the repository root for full details.
*/

import { useCallback } from "react";
import { logger } from "matrix-js-sdk/lib/logger";
import { secureRandomString } from "matrix-js-sdk/lib/randomstring";

import { useClient } from "../ClientContext";
import { useInteractiveRegistration } from "../auth/useInteractiveRegistration";
import { generateRandomName } from "../auth/generateRandomName";
import { useRecaptcha } from "../auth/useRecaptcha";
import { widget } from "../widget";

interface UseRegisterPasswordlessUserType {
  privacyPolicyUrl?: string;
  registerPasswordlessUser: (displayName: string) => Promise<void>;
  recaptchaId?: string;
}

export function useRegisterPasswordlessUser(): UseRegisterPasswordlessUserType {
  const { setClient } = useClient();
  const { privacyPolicyUrl, recaptchaKey, register } =
    useInteractiveRegistration();
  const { execute, reset, recaptchaId } = useRecaptcha(recaptchaKey);

  const registerPasswordlessUser = useCallback(
    async (displayName: string) => {
      if (!setClient) {
        throw new Error("No client context");
      }
      if (widget) {
        throw new Error(
          "Registration was skipped: We should never try to register password-less user in embedded mode.",
        );
      }

      try {
        // 这里只记录注册游客账号的入口状态，不打印显示名称本身，避免把用户输入写进日志。
        logger.info(
          `[guest-registration] start: hasDisplayName=${Boolean(displayName.trim())} widgetMode=${Boolean(widget)}`,
        );
        const recaptchaResponse = await execute();
        const userName = generateRandomName();
        const [client, session] = await register(
          userName,
          secureRandomString(16),
          displayName,
          recaptchaResponse,
          true,
        );
        setClient(client, session);
        logger.info("[guest-registration] success: passwordless client created");
      } catch (e) {
        logger.error("[guest-registration] failed", e);
        reset();
        throw e;
      }
    },
    [execute, reset, register, setClient],
  );

  return { privacyPolicyUrl, registerPasswordlessUser, recaptchaId };
}
