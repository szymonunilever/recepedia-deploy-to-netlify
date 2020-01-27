import { WindowLocation } from '@reach/router';
import { graphql, navigate, useStaticQuery } from 'gatsby';
import {
  IntroductionPanel as WizardIntroductionPanel,
  Quiz as WizardQuiz,
  Wizard,
  Menu,
} from 'gatsby-awd-components/src';
import DigitalData from 'integrations/DigitalData';
import React, { useCallback, useState, useEffect } from 'react';
import { IMAGE_SIZES, MealPlannerPersonalizationFormulas } from 'src/constants';
import { ReactComponent as CheckMarkIcon } from 'src/svgs/inline/checkmark-bigger.svg';
import DataCapturingForm from '../../components/DataCapturingForm';
import SEO from '../../components/Seo';
// Component Styles
import '../../scss/pages/_mealPlanner.scss';
import { findPageComponentContent } from '../../utils';
import { MealPlannerRenameDialog } from '../../components/MealPlannerRenameDialog';
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
import { MealPlannerResults } from 'src/components/MealPannerResults';
import Navigation from 'src/components/Navigation/Navigation';
import { getPagePath } from '../../utils/getPagePath';
import { esResponseHandler } from '../../utils/esResponseHandler';
import smartOutline from 'smart-outline';

const MAX_PER_MP = 7;
const RESULT_SIZE = MAX_PER_MP * 2;

const MealPlannerPage = ({ pageContext, location }: MealPlannerProps) => {
  useEffect(() => {
    smartOutline.init();
  }, []);

  const { allCommonComponent, allSite } = useStaticQuery(graphql`
    {
      allCommonComponent {
        nodes {
          content
          name
        }
      }
      allSite {
        nodes {
          siteMetadata {
            lang
          }
        }
      }
    }
  `);
  const lang: string = allSite.nodes[0].siteMetadata.lang.toLowerCase();
  const componentNodes = allCommonComponent.nodes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentNodes.forEach((component: any) => {
    component.content =
      typeof component.content === 'string'
        ? JSON.parse(component.content)
        : component.content;
  });
  const navComponents = { items: componentNodes };

  const {
    page: { seo, components, type },
  } = pageContext;
  const componentContent = findPageComponentContent(components, 'Wizard');
  const renameDialogContent: AppContent.GeneratedForm.Content = findPageComponentContent(
    components,
    'GeneratedForm',
    'MealPlanerRename'
  );
  const { dataCapturing } = componentContent;
  const wizardResultSection = componentContent.wizardResultSection;
  const linksContent = findPageComponentContent(components, 'Links');
  const [recipes, setRecipes] = useState<Internal.Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [renameDialogShow, setRenameDialogShow] = useState(false);
  const [holdWizardStates, setHoldWizardStates] = useState(false);
  const [mpResultContentTitle, setMpResultContentTitle] = useState(
    wizardResultSection.content.onResult.title
  );
  const [lastSearchProps, setLastSearchProps] = useState<{
    i: number;
    fromChanged: number;
    total: number;
  }>({ i: 0, fromChanged: FROM, total: 0 });
  const userProfileUrl = getPagePath('UserProfile');
  const processSearchData = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quizData: any,
    i = 0,
    fromChanged = FROM
  ) => {
    setLastSearchProps({
      ...lastSearchProps,
      i,
    });

    setIsLoading(true);
    // @ts-ignore
    const MPFormula = MealPlannerPersonalizationFormulas[lang];
    const maxTry = MPFormula.template.length;
    const queryString = generateQuery(
      getUserProfileByKey(ProfileKey.initialQuiz),
      quizData.data,
      MPFormula,
      i
    );
    saveUserProfileByKey(quizData.data, ProfileKey.mealPlannerAnswers);

    getPersonalizationSearchData(queryString, {
      from: fromChanged,
      size: RESULT_SIZE,
      sort: [{ creationTime: { order: 'desc' } }],
    }).then(res => {
      const { data, total, byField } = esResponseHandler(res, 'recipeId');

      setIsLoading(false);
      i++;
      if (total === 0 && i < maxTry) {
        processSearchData(quizData, i);
      } else {
        if (data && data.length) {
          setRecipes(fromChanged === FROM ? data : [...recipes, ...data]);
          setLastSearchProps({
            ...lastSearchProps,
            fromChanged: fromChanged + data.length,
            total: total,
          });
          saveUserProfileByKey(byField, ProfileKey.mealPlannerResults);
        }
      }
    });
  };

  const dataCapturingDone = useCallback(() => {
    setRenameDialogShow(true);
    setHoldWizardStates(true);
  }, [recipes]);

  const renameMealPlanner = useCallback(
    (val?: string) => {
      if (renameDialogShow) {
        const name = val || wizardResultSection.content.onResult.title;
        saveUserProfileByKey(name, ProfileKey.mealPlannerName);
        setMpResultContentTitle(name);
      }
      setRenameDialogShow(false);
    },
    [renameDialogShow]
  );

  const stepResultsCallback = useCallback(quizData => {
    if (
      Object.keys(quizData.data).length ===
      componentContent.wizardQuiz.questions.length
    ) {
      processSearchData(quizData);
    }
  }, []);
  const wizardCallback = useCallback(() => {
    navigate(`${userProfileUrl}?tabOpen=MealPlanner`);
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
      <a className="skip-to-content" href="#content">
        Skip To Content
      </a>
      <Navigation
        navigationContent={
          findPageComponentContent(
            navComponents,
            'GlobalNavigation'
          ) as AppContent.GlobalNavigation.Content
        }
        searchContent={
          findPageComponentContent(
            navComponents,
            'SearchInput'
          ) as AppContent.SearchInput.Content
        }
        profileContent={
          findPageComponentContent(
            navComponents,
            'Profile'
          ) as AppContent.ProfileHeader.Content
        }
      />
      <section>
        <Wizard actionCallback={wizardCallback}>
          <WizardIntroductionPanel
            {...componentContent.wizardIntroductionPanel}
            containerClass="wizard--intro"
            stepId="intro"
            imageSizes={IMAGE_SIZES.MEAL_PLANNER.INTRODUCTION}
          />
          <WizardQuiz
            CheckMarkIcon={CheckMarkIcon}
            {...componentContent.wizardQuiz}
            {...{ stepResultsCallback }}
            imageSizesOptions={IMAGE_SIZES.QUIZ_OPTIONS}
            containerClass="wizard--quiz"
            stepId="quiz"
          />
          {(recipes.length > 0 || holdWizardStates) && (
            <DataCapturingForm
              {...dataCapturing}
              url={formUrl}
              stepResultsCallback={dataCapturingDone}
              stepId="mealPlannerDataCapturing"
              formType={formType}
              pathToData={ProfileKey.mealPlannerAnswers}
              containerClass="wizard--form"
              campaignId={process.env['dataCapturing_dcuConfig_mp_campaignId']}
            />
          )}
          {/*
           // @ts-ignore */}
          <MealPlannerResults
            {...{ components }}
            resultContentTitle={mpResultContentTitle}
            stepId="result"
            containerClass="wizard--results wizard--quiz"
            resultsDefault={recipes}
            maxResults={MAX_PER_MP}
            refreshResults={refreshResults}
            callback={pageUpdate}
            isLoading={isLoading}
          />
        </Wizard>

        <MealPlannerRenameDialog
          className="confirmation__dialog meal-planner_rename-dialog"
          callback={renameMealPlanner}
          content={renameDialogContent}
          isOpen={renameDialogShow}
        />
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
