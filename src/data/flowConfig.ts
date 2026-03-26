import { AppConfig } from '../types/flow';

export const appConfig: AppConfig = {
  app: {
    name: 'RAF RoadX & Fund Guide',
    version: '1.0',
  },
  disclaimer: {
    title: 'Important Disclaimer',
    content: [
      'This application is an educational and guidance tool only.',
      'It does NOT provide legal advice.',
      'Users are encouraged to consult a qualified attorney.',
      'You may choose to lodge a claim directly with the Road Accident Fund or through an attorney.',
      'The developers accept no liability for reliance on this tool.',
    ],
    accept_required: true,
  },
  flow: [
    {
      id: 'entry',
      type: 'info',
      title: 'Welcome',
      content:
        'This tool helps you understand RAF claims, eligibility, and possible compensation.',
      next: 'eligibility',
    },
    {
      id: 'eligibility',
      type: 'decision',
      title: 'Eligibility Check',
      questions: [
        {
          id: 'motor_vehicle',
          question: 'Did the injury arise from a motor vehicle accident?',
          type: 'boolean',
        },
        {
          id: 'fault',
          question: 'Was another driver at least partly at fault?',
          type: 'boolean',
        },
      ],
      logic: 'motor_vehicle == true',
      next: 'claim_path',
    },
    {
      id: 'claim_path',
      type: 'choice',
      title: 'How do you want to claim?',
      options: [
        { label: 'Through an Attorney', next: 'attorney_info' },
        { label: 'Directly with RAF', next: 'direct_info' },
      ],
    },
    {
      id: 'attorney_info',
      type: 'info',
      title: 'Using an Attorney',
      content: [
        'An attorney can assist with evidence gathering, expert reports, and negotiations.',
        'Fees may be deducted from your compensation.',
      ],
      next: 'documents',
    },
    {
      id: 'direct_info',
      type: 'info',
      title: 'Direct Claim',
      content: [
        'You can submit your claim directly to RAF.',
        'You will be responsible for all documentation and follow-ups.',
      ],
      next: 'documents',
    },
    {
      id: 'documents',
      type: 'checklist',
      title: 'Required Documents',
      items: [
        'ID Document',
        'Accident Report (SAPS)',
        'Medical Records',
        'Hospital Bills',
        'Proof of Income',
        'RAF 1 Form',
        'RAF 4 (Serious Injury Assessment)',
      ],
      next: 'damages',
    },
    {
      id: 'damages',
      type: 'info',
      title: 'Types of Damages',
      content: [
        'Past Medical Expenses – costs already incurred',
        'Future Medical Expenses – covered via RAF Undertaking (Section 17(4A))',
        'Loss of Earnings (Past & Future)',
        'General Damages (Pain & Suffering – serious injuries only)',
      ],
      next: 'calculator',
    },
    {
      id: 'calculator',
      type: 'calculator',
      title: 'Loss of Earnings Calculator',
      fields: [
        { id: 'monthly_income', label: 'Monthly Income', type: 'number' },
        { id: 'months_off', label: 'Months Off Work', type: 'slider', min: 0, max: 60 },
        { id: 'future_years', label: 'Years Affected', type: 'slider', min: 0, max: 40 },
        { id: 'contingency', label: 'Contingency %', type: 'slider', min: 5, max: 50, default: 15 },
      ],
      formula: {
        past_loss: 'monthly_income * months_off',
        future_loss: '(monthly_income * 12 * future_years) * (1 - contingency/100)',
        total: 'past_loss + future_loss',
      },
      next: 'summary',
    },
    {
      id: 'summary',
      type: 'summary',
      title: 'Claim Summary',
      content: [
        'Estimated Loss of Earnings displayed.',
        'Actual claim values depend on expert reports and RAF assessment.',
      ],
      next: 'flowchart',
    },
    {
      id: 'flowchart',
      type: 'flowchart',
      title: 'RAF Process Overview',
      steps: [
        'Accident Occurs',
        'Medical Treatment',
        'Gather Documents',
        'Submit RAF Claim',
        'RAF Investigation',
        'Medical Assessments',
        'Settlement / Court',
        'Payment / Undertaking Issued',
      ],
    },
  ],
};
