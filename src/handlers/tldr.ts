import { TLDR_SYSTEM } from '../prompts';
import { makeSummarizer } from './summarize';

const tldrHandler = makeSummarizer(
  'tldr',
  'summarizes a URL with an LLM in three sentences',
  'TL;DR',
  TLDR_SYSTEM,
);

export default tldrHandler;
