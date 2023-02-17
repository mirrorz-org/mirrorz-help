export interface Site {
  url: string,
  abbr: string,
  name?: string,
  logo?: string,
  logo_darkmode?: string,
  homepage?: string,
  issue?: string,
  request?: string,
  email?: string,
  group?: string,
  disk?: string,
  note?: string,
  big?: string,
}

export interface Mirror {
  cname: string,
  url: string,
  status: string,
  desc?: string,
  help?: string,
  upstream?: string,
  size?: string,
}

export interface MirrorZLegacy {
  site: Site,
  mirrors: Mirror[]
}

export interface MirrorZLegacyPackExtension {
  redirect: string
}

export type MirrorZLegacyPack = MirrorZLegacy[] | MirrorZLegacyPackExtension;

export interface ParsedMirror {
  cname: string;
  full: string;
  help: string | null;
  upstream: string | undefined;
  desc: string | undefined;
  status: string;
  size: string | undefined;
  source: string;
  note: string | undefined;
}

export interface ParsedMirrorZLegacy {
  [abbr: string]: {
    site: Site,
    baseUrl: string,
    mirrors: {
      [cname: string]: ParsedMirror
    }
  }
}

export interface CnameToMirrorZ {
  [cname: string]: {
    site: Site,
    baseUrl: string,
    mirror: ParsedMirror
  }[]
}
