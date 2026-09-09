/**
 * A third-party user identifier, in the OpenRTB `user.eids` shape.
 *
 * Amazon forwards these to the TAM/UAM bidders the publisher has enabled. The object is
 * meant to be passed through untouched from whoever issued it (ID5, LiveRamp...): `atype`
 * and `ext` are opaque to us and must not be rebuilt.
 *
 * @see https://resources.ams.amazon.com/s/article/external-user-ids
 */
export interface ExternalUserId {
  /** Identifier domain, e.g. `id5-sync.com`. */
  source: string;
  uids: Array<{
    id: string;
    /** OpenRTB agent type. 1 = probabilistic, 2 = device advertising id. */
    atype?: number;
    ext?: Record<string, string>;
  }>;
}

export function validateExternalUserIds(externalUserIds: ExternalUserId[]) {
  if (!Array.isArray(externalUserIds)) {
    throw new Error("'externalUserIds' expected an array value");
  }
  externalUserIds.forEach((externalUserId, index) => {
    if (typeof externalUserId?.source !== 'string') {
      throw new Error(
        `'externalUserIds[${index}].source' expected a string value`
      );
    }
    if (!Array.isArray(externalUserId.uids) || !externalUserId.uids.length) {
      throw new Error(
        `'externalUserIds[${index}].uids' expected a non-empty array value`
      );
    }
    externalUserId.uids.forEach((uid, uidIndex) => {
      if (typeof uid?.id !== 'string') {
        throw new Error(
          `'externalUserIds[${index}].uids[${uidIndex}].id' expected a string value`
        );
      }
    });
  });
}
