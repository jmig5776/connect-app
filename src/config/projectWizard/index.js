import _ from 'lodash'
import typeToSpecification from '../projectSpecification/typeToSpecification'
import { evaluate } from 'expression-evaluator'
import { removeValuesOfHiddenNodes } from '../../helpers/wizardHelper'
import { flatten } from 'flat'

const products = {
  App: {
    icon: 'product-cat-app',
    info: 'Build a phone, tablet, wearable, or desktop app',
    question: 'What do you need to develop?',
    id: 'app',
    aliases: ['all-apps'],
    subtypes: {
      App: {
        brief: 'Apps',
        details: 'Build apps for mobile, web, or wearables',
        icon: 'product-app-app',
        id: 'application_development',
        aliases: ['app', 'application_development']
      },
      'Enterprise Mobile': {
        brief: 'Enterprise Mobile',
        details: 'Enterprise Mobile',
        formTitle: 'Enterprise Mobile',
        icon: 'product-app-app',
        id: 'enterprise_mobile',
        aliases: ['enterprise-mobile'],
        hidden: true
      },
      'Enterprise Web': {
        brief: 'Enterprise Web',
        details: 'Enterprise Web',
        formTitle: 'Enterprise Web',
        icon: 'product-app-app',
        id: 'enterprise_web',
        aliases: ['enterprise-web'],
        hidden: true
      },
      'topgear-dev': {
        brief: 'Topgear',
        details: 'Topgear',
        formTitle: 'Topgear',
        icon: 'product-app-app',
        id: 'topgear_dev',
        aliases: ['topgear-dev'],
        hidden: true
      },
      'caas-intake': {
        brief: 'CaaS',
        details: 'CaaS',
        formTitle: 'CaaS',
        icon: 'product-app-app',
        id: 'caas_intake',
        aliases: ['caas-intake', 'caas', 'caas_intake'],
        hidden: true
      }
    }
  },
  Website: {
    icon: 'product-cat-website',
    info: 'Design and build the high-impact pages for your blog, online store, or company',
    question: 'What do you need to develop?',
    id: 'website',
    aliases: ['all-websites'],
    subtypes: {
      Website: {
        brief: 'Websites',
        details: 'Build responsive or regular websites',
        icon: 'product-website-website',
        id: 'website_development',
        aliases: ['website', 'website_development']
      }
    }
  },
  Chatbot: {
    icon: 'product-cat-chatbot',
    info: 'Build, train and test a custom conversation for your chatbot',
    question: 'What do you need to develop?',
    id: 'chatbot',
    aliases: ['all-chatbots'],
    subtypes: {
      'Watson Chatbot': {
        brief: 'Watson Chatbot',
        details: 'Build Chatbot using IBM Watson',
        formTitle: 'AI Chatbot with Watson',
        formDesclaimer: 'IBM is receiving compensation from Topcoder for referring customers to Topcoder.',
        icon: 'product-chatbot-watson',
        id: 'watson_chatbot',
        aliases: ['watson_chatbot', 'watson-chatbot'],
        hidden: true
      },
      Chatbot: {
        brief: 'Chatbot',
        details: 'Build, train and test a custom conversation for your chat bot',
        icon: 'product-chatbot-chatbot',
        id: 'generic_chatbot',
        aliases: ['chatbot', 'generic_chatbot']
      },
      'Computer Vision': {
        brief: 'TBD',
        details: 'Work with images to recognize patterns, compute correspondences, etc',
        icon: 'product-qa-crowd-testing',
        id: 'computer_vision',
        aliases: ['computer-vision', 'computer_vision'],
        hidden : true
      }, /*,
      'Algorithm Optimization': {
        brief: 'TBD',
        details: 'Boost the performance (speed or accuracy) of an existing or new algorithm',
        icon: 'product-qa-crowd-testing',
        id: 'algorithm_optimization',
        aliases: ['algorithm_optimization', 'algorithm-optimization', 'algo_optimization']
      },
      'Predictive Analytics': {
        brief: 'TBD',
        details: 'Starting with a set of data and well-defined objectives, model trends and predict outcomes',
        icon: 'product-qa-crowd-testing',
        id: 'predictive-analytics',
        aliases: ['predictive-analytics', 'predictive_analytics']
      },
      */
      'Data Exploration': {
        brief: 'TBD',
        details: 'Ask a crowd of experts to look at your data, understand your goals, and suggest solutions',
        icon: 'product-qa-crowd-testing',
        id: 'data_exploration',
        aliases: ['data-exploration', 'data_exploration'],
        hidden  : true
      }
    }
  },
  Design: {
    icon: 'product-cat-design',
    info: 'Pick the right design project for your needs - wireframes, visual, or other',
    question: 'What kind of design do you need?',
    id: 'visual_design',
    aliases: ['all-designs'],
    subtypes: {
      Wireframes: {
        brief: '10-15 screens',
        details: 'Plan and explore the navigation and structure of your app',
        icon: 'product-design-wireframes',
        id: 'wireframes',
        aliases: ['wireframes'],
        basePriceEstimate: 5000,
        baseTimeEstimateMin: 7,
        baseTimeEstimateMax: 10
      },
      'App Visual Design - Concepts': {
        brief: '1-15 screens',
        details: 'Visualize and test your app requirements and ideas',
        icon: 'product-design-app-visual',
        id: 'visual_design_concepts',
        aliases: ['visual_design_concepts'],
        disabled: true
      },
      'Visual Design': {
        brief: '1-15 screens',
        details: 'Create development-ready designs',
        icon: 'product-design-app-visual',
        id: 'visual_design_prod',
        aliases: ['visual-design', 'visual_design_prod'],
        basePriceEstimate: 5000,
        baseTimeEstimateMin: 7,
        baseTimeEstimateMax: 10
      },
      Infographic: {
        brief: 'Infographic',
        details: 'Present your data in an easy-to-understand and interesting way',
        icon: 'product-design-infographic',
        id: 'infographic',
        aliases: ['infographic'],
        disabled: true
      },
      'Other Design': {
        brief: 'other designs',
        details: 'Get help with other types of design',
        icon: 'product-design-other',
        id: 'generic_design',
        aliases: ['generic-design', 'generic_design'],
        basePriceEstimate: 5000,
        baseTimeEstimateMin: 7,
        baseTimeEstimateMax: 10
      }
    }
  },
  'Software Development' : {
    icon: 'product-cat-development',
    info: 'Get help with any part of your development lifecycle',
    question: 'What kind of development do you need?',
    id: 'app_dev',
    aliases: ['all-development'],
    subtypes: {
      'Front-end Prototype': {
        brief: '3-20 screens',
        details: 'Translate designs to a web (HTML/CSS/JavaScript) or mobile prototype',
        icon: 'product-dev-prototype',
        id: 'visual_prototype',
        aliases: ['visual-prototype', 'visual_prototype'],
        disabled: true
      },
      'Front-end': {
        brief: '',
        details: 'Translate your designs into Web or Mobile front-end',
        icon: 'product-dev-front-end-dev',
        id: 'frontend_dev',
        aliases: ['frontend-development', 'frontend_dev']
      },
      'Back-end & API': {
        brief: '',
        details: 'Build the server, DB, and API for your app',
        icon: 'product-dev-integration',
        id: 'api_dev',
        aliases: ['api-development', 'api_dev']
      },
      'Development Integration': {
        brief: 'Tasks or adhoc',
        details: 'Get help with any part of your app or software',
        icon: 'product-dev-other',
        id: 'generic_dev',
        aliases: ['generic-development', 'generic_dev']
      }
    }
  },
  'Analytics & Data Science': {
    icon: 'product-cat-analytics',
    info: 'Algorithm optimization, analtytics & data science projects',
    question: 'What type of analytics project are you interested in?',
    id: 'analytics',
    aliases: ['all-analytics'],
    hidden: true,
    subtypes: {
      'Computer Vision': {
        brief: 'TBD',
        details: 'Recognize patters in images, compute correspondences, etc.',
        icon: 'product-analytics-computer-vision',
        id: 'computer_vision',
        aliases: ['computer-vision', 'computer_vision'],
        hidden: true
      },
      // 'Algorithm Optimization': {
      //   brief: 'TBD',
      //   details: 'Boost the performance of an existing or new algorithm',
      //   icon: 'product-analytics-algorithm-optimization',
      //   id: 'algorithm_optimization',
      //   aliases: ['algorithm_optimization', 'algorithm-optimization', 'algo_optimization']
      // },
      // 'Predictive Analytics': {
      //   brief: 'TBD',
      //   details: 'Model trends and predict outcomes via set of data and objectives',
      //   icon: 'product-analytics-predictive-analytics',
      //   id: 'predictive-analytics',
      //   aliases: ['predictive-analytics', 'predictive_analytics']
      // },
      'Data Exploration': {
        brief: 'TBD',
        details: 'Review your data, extrapolate patterns, and suggest solutions',
        icon: 'product-analytics-data-exploration',
        id: 'data_exploration',
        aliases: ['data-exploration', 'data_exploration'],
        hidden: true
      }
    }
  },
  QA: {
    icon: 'product-cat-qa',
    info: 'Test and fix bugs in your software',
    question: 'What kind of quality assurance (QA) do you need?',
    id: 'quality_assurance',
    aliases: ['all-quality-assurance'],
    subtypes: {
      'Real World Testing': {
        brief: 'TBD',
        details: 'Exploratory Testing, Cross browser-device Testing',
        icon: 'product-qa-crowd-testing',
        id: 'real_world_testing',
        aliases: ['real-world-testing', 'real_world_testing']
      },
      'Mobility Testing': {
        brief: 'TBD',
        details: 'App Certification, Lab on Hire, User Sentiment Analysis',
        icon: 'product-qa-mobility-testing',
        id: 'mobility_testing',
        aliases: ['mobility-testing', 'mobility_testing']
      },
      'Performance Testing': {
        brief: 'TBD',
        details: 'Webpage rendering effiency, Load, Stress and Endurance Test',
        icon: 'product-qa-website-performance',
        id: 'performance_testing',
        aliases: ['performance-testing', 'performance_testing']
      },
      'Health Security Check': {
        brief: 'TBD',
        details: 'Measure your code base against our security baseline using the crowd and tooling ',
        icon: 'product-qa-health-check',
        id: 'health_check',
        aliases: ['health-check', 'health_check'  ],
        hidden: true
      },
      'Performance Tuning': {
        brief: 'TBD',
        details: 'Analyze your JVM based applications and generate recommendations',
        icon: 'product-qa-website-performance',
        id: 'performance_tuning',
        aliases: ['performance-tuning', 'performance_tuning'],
        hidden: true
      },
      'Digital Accessibility': {
        brief: 'TBD',
        details: 'Make sure you app or website conforms to all rules and regulations',
        icon: 'product-qa-digital-accessability',
        id: 'digital_accessability',
        aliases: ['digital-accessability', 'digital_accessability'],
        disabled: true
      },
      'Open Source Automation': {
        brief: 'TBD',
        details: 'Exploratory testing, cross browser testing',
        icon: 'product-qa-os-automation',
        id: 'open_source_automation',
        aliases: ['open-source-automation', 'open_source_automation'],
        disabled: true
      },
      'Consulting & Adivisory': {
        brief: 'TBD',
        details: 'Expert services to get your project covered end-to-end',
        icon: 'product-qa-consulting',
        id: 'consulting_adivisory',
        aliases: ['consulting-adivisory', 'consulting_adivisory'],
        disabled: true
      },
      'Salesforce Accelerator': {
        brief: 'TBD',
        details: 'Salesforce Testing, Cross browser-device Testing',
        icon: 'product-qa-sfdc-accelerator',
        id: 'sfdc_testing',
        aliases: ['sfdc_testing', 'sfdc-testing']
      }
    }
  }

  /*
  Analytics: {
    icon: 'product-cat-qa',
    info: 'Test and fix bugs in your software',
    question: 'What kind of quality assurance (QA) do you need?',
    id: 'analytics',
    aliases: ['all-analytics'],
    hidden: true,
    subtypes: {
      'Computer Vision': {
        brief: 'TBD',
        details: 'Work with images to recognize patterns, compute correspondences, etc',
        icon: 'product-qa-crowd-testing',
        id: 'computer_vision',
        aliases: ['computer-vision', 'computer_vision']
      },
      'Algorithm Optimization': {
        brief: 'TBD',
        details: 'Boost the performance (speed or accuracy) of an existing or new algorithm',
        icon: 'product-qa-crowd-testing',
        id: 'algorithm_optimization',
        aliases: ['algorithm_optimization', 'algorithm-optimization', 'algo_optimization']
      },
      'Predictive Analytics': {
        brief: 'TBD',
        details: 'Starting with a set of data and well-defined objectives, model trends and predict outcomes',
        icon: 'product-qa-crowd-testing',
        id: 'predictive-analytics',
        aliases: ['predictive-analytics', 'predictive_analytics']
      },
      'Data Exploration': {
        brief: 'TBD',
        details: 'Ask a crowd of experts to look at your data, understand your goals, and suggest solutions',
        icon: 'product-qa-crowd-testing',
        id: 'data-exploration',
        aliases: ['data-exploration', 'data_exploration']
      }
    }
  }
  */
}

export default products

// exports all project types as an array
export const projectTypes = _.mapValues(products, (p, key) => ({...p, name: key }) )

/**
 * Finds product for the given product id. It compares the given value against product id and aliases.
 *
 * @param {string}  productId    id of the product.
 * @param {boolean} aliasesOnly  flag to limit the search to aliases only
 *
 * @return {object} product object from the catalouge
 */
export function findProduct(productId, aliasesOnly = false) {
  for(const pType in products) {
    for(const prd in products[pType].subtypes) {
      const subType = products[pType].subtypes[prd]
      if ((subType.id === productId && !aliasesOnly) || (subType.aliases && subType.aliases.indexOf(productId) !== -1)) {
        return { ...subType, name: prd}
      }
    }
  }
}

/**
 * Finds project category for the given category id. It compares the given value against id and aliases.
 *
 * @param {string}  categoryId    id of the category.
 * @param {boolean} aliasesOnly  flag to limit the search to aliases only
 *
 * @return {object} project category object from the catalouge
 */
export function findCategory(categoryId, aliasesOnly = false) {
  for(const key in products) {
    const product = products[key]
    if (!product.disabled && ((product.id === categoryId && !aliasesOnly) || (product.aliases && product.aliases.indexOf(categoryId) !== -1))) {
      return { ...product, name: key}
    }
  }
  return null
}

/**
 * Finds products of the given category id. Never returns disabled products
 *
 * @param {string}  categoryId   id of the category.
 * @param {boolean} fetchHidden  flag to limit the hidden products
 *
 * @return {Array} non disabled products of the given category from the catalouge
 */
export function findProductsOfCategory(categoryId, fetchHidden = true) {
  for(const pType in products) {
    if (products[pType].id === categoryId) {
      const ret = []
      for(const prd in products[pType].subtypes) {
        const product = products[pType].subtypes[prd]
        if (!product.disabled && (fetchHidden || !product.hidden)) {
          ret.push({ ...products[pType].subtypes[prd], name: prd })
        }
      }
      return ret
    }
  }
}

/**
 * Finds project category for the given product id. It compares the given value against id and aliases.
 *
 * @param {string}  productId    id of the category.
 * @param {boolean} aliasesOnly  flag to limit the search to aliases only
 *
 * @return {object} project category object, from the catalouge, for the given product
 */
export function findProductCategory(productId, aliasesOnly = false) {
  for(const pType in products) {
    for(const prd in products[pType].subtypes) {
      const subType = products[pType].subtypes[prd]
      if (!subType.disabled && ((subType.id === productId && !aliasesOnly) || (subType.aliases && subType.aliases.indexOf(productId) !== -1))) {
        return { ...products[pType], name: pType}
      }
    }
  }
}

/**
 * Finds field from the project creation template
 *
 * @param {string} product      id of the product. It should resolve to a template where search is to be made.
 * @param {string} sectionId    id of the section in the product template
 * @param {string} subSectionId id of the sub section under the section identified by sectionId
 * @param {string} fieldName    name of the field to be fetched
 *
 * @return {object} field from the template, if found, null otherwise
 */
export function getProjectCreationTemplateField(product, sectionId, subSectionId, fieldName) {
  let specification = 'topcoder.v1'
  if (product)
    specification = typeToSpecification[product]
  const sections = require(`../projectQuestions/${specification}`).basicSections
  const section = _.find(sections, {id: sectionId})
  let subSection = null
  if (subSectionId && section) {
    subSection = _.find(section.subSections, {id : subSectionId })
  }
  if (subSection) {
    if (subSectionId === 'questions') {
      return _.find(subSection.questions, { fieldName })
    }
    return subSection.fieldName === fieldName ? subSection : null
  }
  return null
}

/**
 * Helper method to replace the values for conditional variables and then evaluating the expression
 *
 * @param {object} condition condition variable to be replaced by value
 * @param {object} preparedConditions pre-evaluated conditions correspoinding to each key/placeholder
 * @param {object} flatProjectData current project data so far chosen by user
 *
 * @return {boolean} boolean value after replacement of key with value in the condition and parsed against project data
 */
function replaceAndEvaluateCondition(condition, preparedConditions, flatProjectData) {
  let updatedCondition = condition
  _.forOwn(preparedConditions, (baseCondition, placeholder) => {
    updatedCondition = _.replace(updatedCondition, new RegExp(placeholder, 'g'), baseCondition)
  })
  const result = evaluate(updatedCondition, flatProjectData)
  return result
}

/**
 * Helper method to get price and time estimate for the given product.
 *
 * @param {object} priceConfig projcet template's config object against deliverable/addons
 * @param {object} buildingBlocks basic building blocks which combine to define a deliverable
 * @param {object} preparedConditions pre-evaluated conditions correspoinding to each key/placeholder
 * @param {object} flatProjectData current project data so far chosen by user
 * @param {object} evaluateAllConfigs whether to stop at first match or not
 *
 * @return {object} object containing price and time estimate
 */
function getFilteredBuildingBlocks(priceConfig, buildingBlocks, preparedConditions, flatProjectData, evaluateAllConfigs = false) {
  const priceKeys = []
  const priceConfigKeys = _.keys(priceConfig)
  _.forEach(priceConfigKeys, condition => {
    const result = replaceAndEvaluateCondition(condition, preparedConditions, flatProjectData)
    if (result && (evaluateAllConfigs || priceKeys.length === 0)) {
      priceKeys.push(condition)
    }
  })
  const matchedBlocks = []
  _.forEach(priceKeys, priceKey => {
    const allBlocks = priceConfig[priceKey]
    let filterdBlocks = []
    for(const idx in allBlocks) {
      const blocks = allBlocks[idx]
      const passingBlocks = _.filter(blocks, b => {
        const bBlock = buildingBlocks[b]
        if (!bBlock) {
          console.log('Building Block not found for ' + b)
          return false
        }
        const result = replaceAndEvaluateCondition(bBlock.conditions, preparedConditions, flatProjectData)
        return result === true
      })
      if (passingBlocks.length === blocks.length) {
        filterdBlocks = filterdBlocks.concat(passingBlocks)
        if (!evaluateAllConfigs) {
          break
        }
      }
    }
    _.forEach(filterdBlocks, fb => {
      const bb = {
        ...buildingBlocks[fb],
        buildingBlockKey: fb,
      }
      matchedBlocks.push(bb)
    })
  })
  return matchedBlocks
}

/**
 * Helper method to get price and time estimate for the given product.
 *
 * @param {object} projectTemplate projcet template to get the config values
 * @param {object} projectData project object which contains the current value
 *
 * @return {object} object containing price and time estimate
 */
export function getProductEstimate(projectTemplate, projectData) {
  let price = 0
  let minTime = 0
  let maxTime = 0
  let matchedBlocks = []
  const flatProjectData = flatten(removeValuesOfHiddenNodes(projectTemplate, projectData), { safe: true })
  if (projectTemplate) {
    const sections = _.get(projectTemplate, 'scope.sections')
    const addonPriceConfig = _.get(projectTemplate, 'scope.addonPriceConfig', {})
    const priceConfig = _.get(projectTemplate, 'scope.priceConfig', {})
    const buildingBlocks = _.get(projectTemplate, 'scope.buildingBlocks', {})
    const preparedConditions = _.cloneDeep(_.get(projectTemplate, 'scope.preparedConditions', {}))
    _.forOwn(preparedConditions, (cond, placeholder) => {
      preparedConditions[placeholder] = evaluate(cond, flatProjectData) === true ? '1 == 1' : '1 == 2'
    })
    const baseBlocks = getFilteredBuildingBlocks(priceConfig, buildingBlocks, preparedConditions, flatProjectData)
    const addonBlocks = getFilteredBuildingBlocks(addonPriceConfig, buildingBlocks, preparedConditions, flatProjectData, true)
    // for each addon block, check if user has specified quantity for the selected addons
    addonBlocks.forEach((addonBlock) => {
      // retrieves productKey for the addon
      const addonKey = addonBlock.metadata.addonProductKey
      // retrieves the location of storing the selected addons details
      const addonLocation = addonBlock.metadata.addonLocation
      if (addonKey && addonLocation) { // if addon block is configured to pick quantity of the addon
        const addonsData = flatProjectData[addonLocation]
        // finds the addon details for the current addon block
        const addon = _.find(addonsData, ad => ad.productKey === addonKey)
        if (addon && addon.qty) {
          addonBlock.quantity = addon.qty
        }
      }
    })
    matchedBlocks = matchedBlocks.concat(baseBlocks, addonBlocks)
    if (!matchedBlocks || matchedBlocks.length === 0) {
      price = _.get(projectTemplate, 'scope.basePriceEstimate', 0)
      minTime = _.get(projectTemplate, 'scope.baseTimeEstimateMin', 0)
      maxTime = _.get(projectTemplate, 'scope.baseTimeEstimateMax', 0)
    } else {
      _.forEach(matchedBlocks, bb => {
        const bbPrice = _.isString(bb.price) ? evaluate(bb.price, flatProjectData) : bb.price
        price += (bbPrice * (bb.quantity ? bb.quantity : 1))
        minTime += bb.minTime
        maxTime += bb.maxTime
      })
    }
    // picks price from the first config for which condition holds true

    if (sections) {
      sections.forEach((section) => {
        const subSections = section.subSections
        if (subSections) {
          subSections.forEach((subSection) => {
            // supporting only questions sub section
            if (subSection.type === 'questions') {
              const questions = subSection.questions
              questions.forEach((q) => {
                // right now we are supporting only radio-group and tiled-radio-group type of questions
                if(['radio-group', 'tiled-radio-group'].indexOf(q.type) !== -1 && q.affectsQuickQuote) {
                  const answer = _.get(projectData, q.fieldName)
                  const qOption = _.find(q.options, (o) => o.value === answer)
                  price += _.get(qOption, 'quoteUp', 0)
                  minTime += _.get(qOption, 'minTimeUp', 0)
                  maxTime += _.get(qOption, 'maxTimeUp', 0)
                }
                // right now we are supporting only radio-group and tiled-radio-group type of questions
                if(['checkbox-group'].indexOf(q.type) !== -1 && q.affectsQuickQuote) {
                  const answer = _.get(projectData, q.fieldName)
                  if (answer) {
                    answer.forEach((a) => {
                      const qOption = _.find(q.options, (o) => o.value === a)
                      price += _.get(qOption, 'quoteUp', 0)
                      minTime += _.get(qOption, 'minTimeUp', 0)
                      maxTime += _.get(qOption, 'maxTimeUp', 0)
                    })
                  }
                }
              })
            }
          })
        }
      })
    }
  }
  const durationEstimate = minTime !== maxTime ? `${minTime}-${maxTime}` : `${minTime}`
  return {
    priceEstimate: price,
    minTime,
    maxTime,
    durationEstimate: `${durationEstimate} days`,
    estimateBlocks: matchedBlocks
  }
}

/**
 * Finds if files are required for project
 *
 * @param {object} project       project object
 * @param {object} subSections   subSections object
 *
 * @return {boolean} true if files required, else false
 */
export function isFileRequired(project, subSections) {
  const subSection = _.find(subSections, (s) => s.type === 'questions')
  const fields = _.filter(subSection.questions, q => q.type.indexOf('see-attached') > -1)
  // iterate over all seeAttached type fields to check
  //  if any see attached is checked.
  return _.some(_.map(
    _.map(fields, 'fieldName'),
    fn => _.get(project, `${fn}.seeAttached`)
  ))
}

/**
 * Finds the title for the product
 *
 * @param {object}  project       project object to fetch the product title
 * @param {boolean} showProduct   flag to check whether to show title from config or not
 *
 * @return {string} title of the product
 */
export function findTitle(project, showProduct) {
  const product = _.get(project, 'details.products[0]')
  if (showProduct && product) {
    const prd = findProduct(product)
    if (prd) return prd.name
  }
  return 'Definition'
}

/**
 * Finds the title for the project files section
 *
 * @param {object}  project    project object to fetch the product title
 *
 *
 * @return {string} title for the project files section
 */
export function findFilesSectionTitle(project) {
  return `Project Files (${_.get(project, 'attachments', []).length})` || 'Files'
}
