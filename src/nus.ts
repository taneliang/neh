// National University of Singapore-related data and utils

import FuzzySet from 'fuzzyset.js';

export type NUSMod = {
  coursemology?: string;
  luminus?: string;
  panopto?: string;
};

export const modules: { [modcode: string]: NUSMod } = {
  CS3219: {
    luminus: '42f051f9-44d2-4393-8ed5-e79d4a97b8de',
    panopto: 'a37a4fec-408e-4e1e-9a89-aabc000a5ce8',
  },
  CS3230: {
    luminus: 'b85e28eb-bab3-4375-b03e-16f0ce45a591',
    panopto: '4da3b08c-eb31-4fea-a07e-aa9600837aa3',
  },
  CS3244: {
    coursemology: '1677',
    luminus: '783480f2-d3be-4587-843d-d73140337bec',
  },
  CS4211: {
    luminus: 'e24ac9c6-1c2b-4c0d-a4d7-91bc3121e5d6',
    panopto: 'd538678a-c436-47e3-b768-aa6f00868281',
  },
  CS4246: {
    luminus: 'b864e4ca-c625-475b-931e-e48dcd746058',
    panopto: 'c00ebc7d-88e6-443f-9528-aaa90034c033',
  },
};

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
