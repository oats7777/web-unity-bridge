import { LOAD_STATUS } from "../config/unity-loader-status";
import { Observable } from "./observable";
import type { UnityLoaderStatus } from "../config/unity-loader-status";
import type { UnityConfig } from "../types/unity-config";

class ScriptLoaderMethod extends Observable<UnityLoaderStatus> {
  public status: UnityLoaderStatus = LOAD_STATUS.Loading;
  public config: UnityConfig;

  constructor(config: UnityConfig) {
    super();
    this.config = config;
    this.load = this.load.bind(this);
  }

  private setStatus(status: UnityLoaderStatus) {
    this.status = status;
    this.notifyObservers(status);
  }

  public async load() {
    if (!this.config.loaderUrl) {
      this.setStatus(LOAD_STATUS.Idle);
      return;
    }

    let script: HTMLScriptElement | null = window.document.querySelector(
      `script[src="${this.config.loaderUrl}"]`
    );

    if (script === null) {
      script = window.document.createElement("script");
      script.type = "text/javascript";
      script.src = this.config.loaderUrl;
      script.async = true;
      script.setAttribute("data-status", LOAD_STATUS.Loading);
      window.document.body.appendChild(script);

      script.addEventListener("load", () => {
        script?.setAttribute("data-status", LOAD_STATUS.Loaded);
      });
      script.addEventListener("error", () => {
        script?.setAttribute("data-status", LOAD_STATUS.Error);
      });
    } else {
      this.setStatus(
        script.getAttribute("data-status") === LOAD_STATUS.Loaded
          ? LOAD_STATUS.Loaded
          : LOAD_STATUS.Error
      );
    }

    const setStateFromEvent = (event: Event) =>
      this.setStatus(
        event.type === "load" ? LOAD_STATUS.Loaded : LOAD_STATUS.Error
      );
    script.addEventListener("load", setStateFromEvent);
    script.addEventListener("error", setStateFromEvent);
  }
}

export { ScriptLoaderMethod };
