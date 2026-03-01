import { Fragment } from 'react';
import { MDXComponents } from '../../components/mdx-components';

// Deserialize a client React tree from JSON.
export function reviveNodeOnClient(parentPropertyName: string, val: any) {
  if (Array.isArray(val) && val[0] === '$r') {
    // Assume it's a React element.
    let Type = val[1];
    let key = val[2];
    if (key == null) {
      key = parentPropertyName; // Index within a parent.
    }
    let props = val[3];
    if (Type === 'wrapper') {
      Type = Fragment;
      props = { children: props.children };
    }
    if (Type in MDXComponents) {
      Type = MDXComponents[Type];
    }
    if (!Type) {
      if (Type !== null) {
        console.error('[reviveNodeOnClient] Unknown type: ' + Type);
      }
      Type = Fragment;
    }
    return <Type key={key} {...props} />;
  }

  return val;
}

// Serialize a server React tree node to JSON.
export function stringifyNodeOnServer(key: unknown, val: any) {
  if (
    val?.$$typeof === Symbol.for('react.transitional.element')
  ) {
    // Remove fake MDX props.

    const { mdxType, originalType, parentName, ...cleanProps } = val.props;
    return [
      '$r',
      typeof val.type === 'string' ? val.type : mdxType,
      val.key,
      cleanProps
    ];
  }
  return val;
}
