import { SUM_SYSTEM } from '../prompts';
import { makeSummarizer } from './summarize';

const sumHandler = makeSummarizer(
  'sum',
  'summarizes a URL with an LLM (3 to 5 paragraphs)',
  'Summary',
  SUM_SYSTEM,
);

export default sumHandler;
