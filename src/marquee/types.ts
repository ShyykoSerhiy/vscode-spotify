import type { Webview } from "vscode";

interface VSCodeWebview extends Webview {
  getState: () => any;
  setState: (param: any) => void;
}

export interface ThirdPartyWidgetOptions {
  name: string;
  icon: any;
  label: string;
  tags: string[];
  description: string;
}

export interface MarqueeInterface {
  defineWidget: (
    widgetOptions: ThirdPartyWidgetOptions,
    constructor: CustomElementConstructor,
    options?: ElementDefinitionOptions
  ) => void;
}

export interface MarqueeWindow extends Window {
  marqueeExtension: MarqueeInterface;
  vscode: VSCodeWebview;
}
