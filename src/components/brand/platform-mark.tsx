import type { JSX } from "react";

import { AwsMark, AzureMark, LinuxMark, WindowsMark } from "@/components/brand/cloud-marks";
import type { Platform } from "@/content/products";

/**
 * A platform's mark as it sits in a chip: the "Runs on" chips, the clouds on a
 * login card.
 *
 * The mock gives the marks the same classes in all of those places — none on
 * Azure or Windows, `aws` on the smile, `tux` on the penguin — and each
 * surface's own sheet sizes and inks them from there (`.chip svg.aws`,
 * `.login .az .tux`). So the classes are fixed here, and a surface that frames
 * a mark differently draws it from `cloud-marks` itself.
 */
export interface PlatformMarkProps {
  readonly platform: Platform;
  /** Azure's gradient ids must be unique in the document; see `AzureMark`. */
  readonly idSuffix: string;
}

export function PlatformMark({ platform, idSuffix }: PlatformMarkProps): JSX.Element {
  switch (platform) {
    case "azure":
    case "aks":
      return <AzureMark idSuffix={idSuffix} />;
    case "aws":
    case "eks":
      return <AwsMark className="aws" />;
    case "windows":
      return <WindowsMark />;
    case "linux":
      return <LinuxMark className="tux" />;
  }
}
