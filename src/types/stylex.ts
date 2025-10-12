import type stylex from '@stylexjs/stylex';

type StyleXRules = ReturnType<typeof stylex.create>;
export type StyleXRulesAndFalsy = StyleXRules[string] | false | null | undefined;
export type WithXStyleProps<T> = Omit<T, 'className'> & { xstyle?: StyleXRulesAndFalsy[] };
