export type Theme = "dark";

export interface ConfigProps {
  appName: string;
  appDescription: string;
  domainName: string;
  colors: {
    theme: Theme;
    main: string;
  };
  auth: {
    loginUrl: string;
    callbackUrl: string;
  };
}
