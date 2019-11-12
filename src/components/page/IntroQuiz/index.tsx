import React, {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ReactComponent as WizardLogo } from '../../../svgs/inline/wizard-logo.svg';
import { ReactComponent as CloseSvg } from '../../../svgs/inline/x-mark.svg';
import {
  getUserProfileByKey,
  saveUserProfileByKey,
} from '../../../utils/browserStorage';
import { ProfileKey } from '../../../utils/browserStorage/models';
import DataCapturingForm from '../../DataCapturingForm';
import { Logo, Modal, Wizard, Quiz as WizardQuiz } from 'src/components/lib';
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

  const wizardAction = useCallback(wizardData => {
    setIsQuizOpened(false);
    setIsQuizPassed(true);
    setUserProfileIQ(wizardData.data.quiz);
    saveUserProfileByKey(wizardData.data.quiz, ProfileKey.initialQuiz);
    onClose && onClose();
  }, []);

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
  const onCloseQuiz = useCallback(() => {
    trackQuiz({ label: `Completed`, result: `Complete` });
  }, [trackQuiz]);

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
          onClose={onCloseQuiz}
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
          />
        )}
      </Wizard>
    </Modal>
  );
};

export default IntroQuiz;
