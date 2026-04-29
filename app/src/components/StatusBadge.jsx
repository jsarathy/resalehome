import styles from './StatusBadge.module.css';

const COLOUR_MAP = {
  // Property statuses
  draft:              'grey',
  listed:             'teal',
  under_offer:        'blue',
  sold:               'ink',
  // Enquiry statuses
  new:                'copper',
  contacted:          'blue',
  viewing_scheduled:  'teal',
  offer_made:         'purple',
  closed:             'ink',
  // Valuation statuses
  requested:          'copper',
  in_progress:        'blue',
  complete:           'teal',
  // Loan statuses
  submitted:          'blue',
  sanctioned:         'teal',
  disbursed:          'ink',
  rejected:           'error',
};

const LABEL_MAP = {
  draft:             'Draft',
  listed:            'Listed',
  under_offer:       'Under Offer',
  sold:              'Sold',
  new:               'New',
  contacted:         'Contacted',
  viewing_scheduled: 'Viewing Scheduled',
  offer_made:        'Offer Made',
  closed:            'Closed',
  requested:         'Requested',
  in_progress:       'In Progress',
  complete:          'Complete',
  submitted:         'Submitted',
  sanctioned:        'Sanctioned',
  disbursed:         'Disbursed',
  rejected:          'Rejected',
};

export default function StatusBadge({ status }) {
  const colour = COLOUR_MAP[status] ?? 'grey';
  const label  = LABEL_MAP[status]  ?? status;
  return (
    <span className={`${styles.badge} ${styles[colour]}`}>
      {label}
    </span>
  );
}
