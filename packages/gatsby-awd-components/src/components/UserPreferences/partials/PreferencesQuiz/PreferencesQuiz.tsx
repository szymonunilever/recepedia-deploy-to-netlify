import React, { Fragment, FunctionComponent } from 'react';
import PreferenceEntry from './partials/PreferenceEntry';
import {
  PreferenceQuizProps,
  LastInteraction,
  PreferenceInteractionType,
} from './index';
import { Text, TagName } from '../../../Text';
import sortByOrderIndex from '../../../../utils/sortByOrderIndex';
import PreferenceUpdateInfo from './partials/PreferenceUpdateInfo';
import { PreferenceUpdateResultType } from './partials';
import {
  Question,
  QuestionFilterPropNameKeys,
} from "../../../Wizard/partials/Quiz";
import PreferenceUpdateBlock from './partials/PreferenceUpdateBlock';
import { RecipeAttributesKeys } from '../../../RecipeAttributes';

const PreferencesQuiz: FunctionComponent<PreferenceQuizProps> = ({
  questions,
  answers,
  heading,
  editingKey,
  setEditingKey,
  deleteQuestion,
  saveQuestion,
  lastInteraction,
  setLastInteraction,
  noResultContent,
  updatePropsContent,
  buttonsContent,
  quizKey,
  icons,
}) => {
  const deleteThisEntry = (key: string) => {
    deleteQuestion(quizKey, key);
    // @ts-ignore
    answers[key] = {};
    setLastInteraction({
      key: key,
      resultType: PreferenceUpdateResultType.Success,
      message: updatePropsContent.deleteProps.success,
      interactionType: PreferenceInteractionType.Delete,
    });
  };

  const saveThisEntry = (
    key: string,
    selectedOptions: {
      value: string | object | null;
      filterPropName: RecipeAttributesKeys | QuestionFilterPropNameKeys;
    }
  ) => {
    // @ts-ignore
    answers[key] = selectedOptions;
    saveQuestion(quizKey, key, selectedOptions);
    const mockResultFromSaveFunction: LastInteraction = {
      key: key,
      resultType: PreferenceUpdateResultType.Success,
      message: updatePropsContent.saveProps.success,
      interactionType: PreferenceInteractionType.Save,
    };
    setLastInteraction(mockResultFromSaveFunction);
  };

  const shouldRenderSuccessfullDelete = (item: Question) => {
    return (
      lastInteraction &&
      lastInteraction.key === item.key &&
      lastInteraction.interactionType === PreferenceInteractionType.Delete &&
      lastInteraction.resultType === PreferenceUpdateResultType.Success
    );
  };

  return (
    <form>
      {(questions || {}).length > 0 && (
        <div className="preferences__title">
          <Text tag={TagName.h3} text={heading} />
        </div>
      )}
      <div className="preferences__content">
        {questions && questions.length ? (
          questions.sort(sortByOrderIndex).map(item => {
            return shouldRenderSuccessfullDelete(item) ? (
              <PreferenceUpdateInfo
                icons={icons}
                key={item.orderIndex}
                show={true}
                resultType={lastInteraction.resultType}
                message={lastInteraction.message}
              />
            ) : (
              <Fragment key={item.key}>
                <PreferenceEntry
                  icons={icons}
                  key={item.orderIndex}
                  preferenceEntry={item}
                  selectedOptions={answers[item.key]}
                  editingKey={editingKey}
                  setEditEntryKey={setEditingKey}
                  setLastInteraction={setLastInteraction}
                  deleteEntry={deleteThisEntry}
                  saveEntry={saveThisEntry}
                  buttonsContent={buttonsContent}
                />
                <PreferenceUpdateBlock
                  icons={icons}
                  key={item.key}
                  lastInteraction={lastInteraction}
                  questionKey={item.key}
                />
              </Fragment>
            );
          })
        ) : (
          <PreferenceUpdateInfo
            icons={icons}
            show={true}
            resultType={PreferenceUpdateResultType.Warning}
            {...noResultContent}
          />
        )}
      </div>
    </form>
  );
};

export default PreferencesQuiz;
