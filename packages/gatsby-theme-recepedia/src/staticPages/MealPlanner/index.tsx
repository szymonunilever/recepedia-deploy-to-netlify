import { navigate } from 'gatsby';
import {
  IntroductionPanel as WizardIntroductionPanel,
  Logo,
  Quiz as WizardQuiz,
  reloadKritiqueWidget as useKritiqueReload,
  Wizard,
  Menu,
} from 'gatsby-awd-components/src';

import DigitalData from 'integrations/DigitalData';
import Kritique from 'integrations/Kritique';
import React, { useCallback, useState } from 'react';
import { IMAGE_SIZES, MealPlannerPersonalizationFormula } from 'src/constants';
import { ReactComponent as CheckMarkIcon } from 'src/svgs/inline/checkmark-bigger.svg';
import DataCapturingForm from '../../components/DataCapturingForm';

import SEO from '../../components/Seo';
// Component Styles
import '../../scss/pages/_mealPlanner.scss';
import { ReactComponent as WizardLogo } from '../../svgs/inline/wizard-logo.svg';
import { findPageComponentContent } from '../../utils';

import {
  getUserProfileByKey,
  saveUserProfileByKey,
} from '../../utils/browserStorage';
import { ProfileKey } from '../../utils/browserStorage/models';
import getPersonalizationSearchData, {
  FROM,
} from '../../utils/getPersonalizationSearchData';
import generateQuery from '../../utils/queryGenerator';
import theme from './mealPlanner.module.scss';
import MealPlannerResults from 'src/components/MealPannerResults';

const MAX_PER_MP = 7;
const RESULT_SIZE = MAX_PER_MP * 2;

const MealPlannerPage = ({ pageContext, location }: MealPlannerProps) => {
  const {
    page: { seo, components, type },
  } = pageContext;
  const componentContent = findPageComponentContent(components, 'Wizard');
  const { dataCapturing } = componentContent;
  const linksContent = findPageComponentContent(components, 'Links');
  const [recipes, setRecipes] = useState<Internal.Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [lastSearchProps, setLastSearchProps] = useState<{
    i: number;
    fromChanged: number;
    total: number;
  }>({ i: 0, fromChanged: FROM, total: 0 });

  const processSearchData = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quizData: any,
    i: number = 0,
    fromChanged = FROM
  ) => {
    setLastSearchProps({
      ...lastSearchProps,
      i,
    });

    setIsLoading(true);
    const maxTry = MealPlannerPersonalizationFormula.template.length;
    const queryString = generateQuery(
      getUserProfileByKey(ProfileKey.initialQuiz),
      quizData.data,
      MealPlannerPersonalizationFormula,
      i
    );
    saveUserProfileByKey(quizData.data, ProfileKey.mealPlannerAnswers);

    getPersonalizationSearchData(queryString, {
      from: fromChanged,
      size: RESULT_SIZE,
      sort: [{ creationTime: { order: 'desc' } }],
    }).then(data => {
      const result = data.body.hits.hits.map(hit => hit._source);
      setIsLoading(false);
      i++;
      if (data.body.hits.total.value === 0 && i < maxTry) {
        processSearchData(quizData, i);
      } else {
        if (result && result.length) {
          setRecipes(fromChanged === FROM ? result : [...recipes, ...result]);
          setLastSearchProps({
            ...lastSearchProps,
            fromChanged: fromChanged + result.length,
            total: data.body.hits.total.value,
          });
          useKritiqueReload();
          saveUserProfileByKey(
            result.map(item => item.recipeId),
            ProfileKey.mealPlannerResults
          );
        }
      }
    });
  };
  const stepResultsCallback = useCallback(quizData => {
    if (
      Object.keys(quizData.data).length ===
      componentContent.wizardQuiz.questions.length
    ) {
      processSearchData(quizData);
    }
  }, []);
  const wizardCallback = useCallback(() => {
    navigate('/perfil?tabOpen=MealPlanner');
  }, []);
  const pageUpdate = useCallback(() => {
    window.location.reload();
  }, []);
  const [formUrl, formType] = [
    process.env['mealPlanerDataCapturing_url'] as string,
    process.env['mealPlanerDataCapturing_formType'] as string,
  ];
  const refreshResults = useCallback(
    (results: Internal.Recipe[], needFetchNewData = false) => {
      if (needFetchNewData) {
        if (lastSearchProps.total > lastSearchProps.fromChanged) {
          processSearchData(
            { data: getUserProfileByKey(ProfileKey.mealPlannerAnswers) },
            lastSearchProps.i,
            lastSearchProps.fromChanged
          );
        } else {
          setRecipes(results);
          saveUserProfileByKey(
            results.map(item => item.recipeId),
            ProfileKey.mealPlannerResults
          );
        }
      } else {
        setRecipes(results);
        saveUserProfileByKey(
          results.map(item => item.recipeId),
          ProfileKey.mealPlannerResults
        );
      }
    },
    []
  );

  return (
    <div className={theme.mealPlanner}>
      <SEO {...seo} canonical={location.href} />
      <DigitalData title={seo && seo.title} type={type} />
      <div className="wizard__logo">
        <Logo icon={<WizardLogo />} path="/" />
      </div>
      <section>
        <Kritique />
        <Wizard actionCallback={wizardCallback}>
          <WizardIntroductionPanel
            {...componentContent.wizardIntroductionPanel}
            containerClass="wizard--intro"
            stepId="intro"
          />
          <WizardQuiz
            CheckMarkIcon={CheckMarkIcon}
            {...componentContent.wizardQuiz}
            {...{ stepResultsCallback }}
            imageSizesOptions={IMAGE_SIZES.QUIZ_OPTIONS}
            containerClass="wizard--quiz"
            stepId="quiz"
          />
          {recipes.length > 0 && (
            <DataCapturingForm
              {...dataCapturing}
              url={formUrl}
              formType={formType}
              pathToData={ProfileKey.mealPlannerAnswers}
              containerClass="wizard--form"
            />
          )}
          {/*
           // @ts-ignore */}
          <MealPlannerResults
            {...{ components }}
            stepId="result"
            containerClass="wizard--results wizard--quiz"
            resultsDefault={recipes}
            maxResults={MAX_PER_MP}
            refreshResults={refreshResults}
            callback={pageUpdate}
            isLoading={isLoading}
          />
        </Wizard>

        <div className="wizard__privacy">
          <Menu list={linksContent.list} />
        </div>
      </section>
    </div>
  );
};

interface MealPlannerProps {
  pageContext: {
    page: AppContent.Page;
  };
  // @ts-ignore
  location: WindowLocation;
}

export default MealPlannerPage;
