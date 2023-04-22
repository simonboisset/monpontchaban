import { createRouter } from '../../config/api';
import { createSupportIssue } from './createSupportIssue';
import { getSupportIssueMessages } from './getSupportIssueMessages';
import { getSupportIssues } from './getSupportIssues';
import { replyToSupportIssueMessage } from './replyToSupportIssueMessage';
import { sendSupportIssueMessage } from './sendSupportIssueMessage';
import { updateSupportIssue } from './updateSupportIssue';

export const supportIssues = createRouter({
  getSupportIssues,
  createSupportIssue,
  updateSupportIssue,
});

export const supportMessages = createRouter({
  getSupportIssueMessages,
  sendSupportIssueMessage,
  replyToSupportIssueMessage,
});
