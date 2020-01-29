import React, {
  ReactChild,
  useState,
  useEffect,
  FunctionComponent,
} from 'react';
import { UserPreferencesProps } from './models';
import PreferencesIntro from './partials/PreferencesIntro';
import ResultCount from './partials/PreferencesQuiz/partials/ResultCount';
import { LastInteraction } from "./partials/PreferencesQuiz";
import theme from './UserPreferences.module.scss';
import cx from 'classnames';

const UserPreferences: FunctionComponent<UserPreferencesProps> = ({
  children,
  deleteQuestion,
  saveQuestion,
  icons,
  content: {
    preferencesIntroContent,
    noResultContent,
    updatePropsContent,
    buttonsContent,
    resultLabelContent,
  },
}) => {
  const [editingKey, setEditingKey] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [lastInteraction, setLastInteraction] = useState<LastInteraction>();
  let enhancedChildren: ReactChild[] = [];

  React.Children.forEach(children, (child, index) => {
    // @ts-ignore
    child && child.props.questions.forEach(question => {
      question.type.labelPosition = 'bottom';
    });

    if (React.isValidElement(child)) {
      const newProps = {
        editingKey,
        setEditingKey,
        deleteQuestion,
        saveQuestion,
        lastInteraction,
        setLastInteraction,
        noResultContent,
        updatePropsContent,
        buttonsContent,
        key: index,
        icons,
      };
      enhancedChildren.push(React.cloneElement(child, newProps));
    }
  });

  useEffect(() => {
    let answersCount = 0;
    React.Children.forEach(children, child => {
      if (React.isValidElement(child)) {
        // @ts-ignore
        answersCount += child.props.questions.length;
      }
    });
    setTotalCount(answersCount);
  }, [children]);

  return (
    <div className={cx(theme.preferences, 'preferences')}>
      <PreferencesIntro {...preferencesIntroContent} />
      {totalCount === 0 && (
        <ResultCount
          icons={icons}
          count={totalCount}
          labelProps={resultLabelContent}
        />
      )}
      <div className="preferences__form">{enhancedChildren}</div>
    </div>
  );
};

export default UserPreferences;
