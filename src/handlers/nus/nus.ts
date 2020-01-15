// National University of Singapore-related data and utils

import FuzzySet from 'fuzzyset.js';
import mods from './modules.json';

export type NUSModBookmarks = { [bookmark: string]: string };

export type NUSMod = {
  coursemology?: string;
  luminus?: string;
  panopto?: string;
  bookmarks?: NUSModBookmarks;
};

export type NUSModOnlyStringValues = Omit<NUSMod, 'bookmarks'>;

export const modules: { [modcode: string]: NUSMod } = mods;

const modcodes = FuzzySet(Object.keys(modules));

export function getClosestModcode(fuzzyModcode: string): string | undefined {
  const hypotheses = modcodes.get(fuzzyModcode, null, 0.5);
  if (!hypotheses) return;
  return hypotheses[0][1];
}

export function getClosestModule(fuzzyModcode: string): NUSMod | undefined {
  const modcode = getClosestModcode(fuzzyModcode);
  if (!modcode) return;
  return modules[modcode];
}
