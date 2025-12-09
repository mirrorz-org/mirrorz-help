import type stylex from '@stylexjs/stylex';

type StyleXRules = ReturnType<typeof stylex.create>;
export type StyleXRulesAndFalsy = StyleXRules[string] | false | null | undefined;
export type WithXStyleProps<T = object> = Omit<T, 'className' | 'style'> & { xstyle?: StyleXRulesAndFalsy | StyleXRulesAndFalsy[] };
