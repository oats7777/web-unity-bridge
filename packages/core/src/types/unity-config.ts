import { type UnityArguments } from './unity-arguments';

type ConfigurableUnityArguments = Pick<
  UnityArguments,
  | 'dataUrl'
  | 'frameworkUrl'
  | 'codeUrl'
  | 'companyName'
  | 'productName'
  | 'productVersion'
  | 'streamingAssetsUrl'
>;

export interface UnityConfig extends ConfigurableUnityArguments {
  readonly loaderUrl: string;
}
