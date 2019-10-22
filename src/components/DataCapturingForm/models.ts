import { ProfileKey } from '../../utils/browserStorage/models';
import {
  titleLevel,
  UnileverLibraryComponent,
  WizardStepComponent,
} from '../lib/models';

export interface DataCapturingFormProps
  extends UnileverLibraryComponent<AppContent.GeneratedForm.Content>,
    WizardStepComponent {
  titleRenderer?: (markup: JSX.Element) => JSX.Element;
  titleLevel?: titleLevel;
  url: string;
  host: string;
  pathToData: ProfileKey;
}

export interface DataPrepopulateProps {
  email: string;
  firstName: string;
  lastName: string;
}
