import React, {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ReactComponent as WizardLogo } from '../../../svgs/inline/wizard-logo.svg';
import { ReactComponent as CloseSvg } from '../../../svgs/inline/x-mark.svg';
import { ReactComponent as CheckMarkIcon } from 'src/svgs/inline/checkmark-bigger.svg';
import {
  getUserProfileByKey,
  saveUserProfileByKey,
} from '../../../utils/browserStorage';
import { ProfileKey } from '../../../utils/browserStorage/models';
import DataCapturingForm from '../../DataCapturingForm';
import { Logo } from 'gatsby-awd-components/src/components/Logo';
import { Modal } from 'gatsby-awd-components/src/components/Modal';
import { Wizard } from 'gatsby-awd-components/src/components/Wizard';
import { Quiz as WizardQuiz } from 'gatsby-awd-components/src/components/Wizard';
import { IntroQuizProps } from './models';
import { trackQuiz } from 'src/tracking/quiz-tracking';

const IntroQuiz: FunctionComponent<IntroQuizProps> = ({
  introContent,
  quizContent,
  onClose,
  imageSizesOptions,
}) => {
  const [isQuizOpened, setIsQuizOpened] = useState(false);
  const [isQuizPassed, setIsQuizPassed] = useState(false);
  const [userProfileIQ, setUserProfileIQ] = useState(
    getUserProfileByKey(ProfileKey.initialQuiz)
  );
  const { dataCapturing } = quizContent;
  const titleRenderer = (markup: JSX.Element) => (
    <div className="wizard__info">
      <div className="wizard__title">{markup}</div>
    </div>
  );

  useEffect(() => {
    !Object.keys(userProfileIQ).length &&
      !isQuizPassed &&
      setIsQuizOpened(true);
  }, [isQuizPassed]);

  const wizardAction = useCallback(
    wizardData => {
      setIsQuizOpened(false);
      setIsQuizPassed(true);
      setUserProfileIQ(wizardData.data.quiz);
      saveUserProfileByKey(wizardData.data.quiz, ProfileKey.initialQuiz);
      trackQuiz({ label: `Completed`, result: `Complete` });
      onClose && onClose();
    },
    [
      setIsQuizOpened,
      setIsQuizPassed,
      setUserProfileIQ,
      saveUserProfileByKey,
      onClose,
      trackQuiz,
    ]
  );

  const stepResultsCallback = useCallback(
    quizData => {
      const step = Object.keys(quizData.data).length;
      const { question, answer } = quizData.data[`question${step}`];
      const finalAnswer = Array.isArray(answer)
        ? answer.map((a: { label: { text: string } }) => a.label.text).join(',')
        : answer.label.text;

      trackQuiz({
        label: `Step ${step}`,
        question,
        answer: finalAnswer,
      });
      saveUserProfileByKey(quizData.data, ProfileKey.initialQuiz);
    },
    [trackQuiz, saveUserProfileByKey]
  );

  const closeCallback = useCallback(() => {
    onClose && onClose();
    return setIsQuizOpened(false);
  }, []);

  const [formUrl, formType] = [
    process.env['quizDataCapturing_url'] as string,
    process.env['quizDataCapturing_formType'] as string,
  ];

  return (
    <Modal
      isOpen={isQuizOpened}
      className="modal--quiz"
      closeBtn={<CloseSvg />}
      close={closeCallback}
    >
      <Wizard actionCallback={wizardAction}>
        {/*
          // @ts-ignore */}
        <WizardQuiz
          CheckMarkIcon={CheckMarkIcon}
          intro={
            <div className="wizard__info">
              <div className="wizard__logo">
                <Logo icon={<WizardLogo />} path="/" />
              </div>
              <h1>{introContent.title}</h1>
              <p className="wizard__description">{introContent.description}</p>
            </div>
          }
          {...quizContent}
          stepResultsCallback={stepResultsCallback}
          containerClass="wizard--quiz wizard--quiz-initial"
          stepId="quiz"
          imageSizesOptions={imageSizesOptions}
        />
        {dataCapturing && (
          <DataCapturingForm
            {...dataCapturing}
            titleRenderer={titleRenderer}
            url={formUrl}
            formType={formType}
            stepId="dataCapturing"
            pathToData={ProfileKey.initialQuiz}
            containerClass="wizard--quiz wizard--quiz-initial"
            campaignId={process.env['dataCapturing_dcuConfig_quiz_campaignId']}
          />
        )}
      </Wizard>
    </Modal>
  );
};

export default IntroQuiz;
