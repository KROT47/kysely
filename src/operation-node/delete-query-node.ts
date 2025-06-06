import { freeze } from '../util/object-utils.js'
import { FromNode } from './from-node.js'
import { JoinNode } from './join-node.js'
import { OperationNode } from './operation-node.js'
import { ReturningNode } from './returning-node.js'
import { WhereNode } from './where-node.js'
import { WithNode } from './with-node.js'
import { LimitNode } from './limit-node.js'
import { OrderByNode } from './order-by-node.js'
import { OrderByItemNode } from './order-by-item-node.js'
import { ExplainNode } from './explain-node.js'
import { UsingNode } from './using-node.js'
import { TopNode } from './top-node.js'
import { OutputNode } from './output-node.js'
import { QueryNode } from './query-node.js'

export interface DeleteQueryNode extends OperationNode {
  readonly kind: 'DeleteQueryNode'
  readonly from: FromNode
  readonly using?: UsingNode
  readonly joins?: ReadonlyArray<JoinNode>
  readonly where?: WhereNode
  readonly returning?: ReturningNode
  readonly with?: WithNode
  readonly orderBy?: OrderByNode
  readonly limit?: LimitNode
  readonly explain?: ExplainNode
  readonly endModifiers?: ReadonlyArray<OperationNode>
  readonly top?: TopNode
  readonly output?: OutputNode
}

/**
 * @internal
 */
export const DeleteQueryNode = freeze({
  is(node: OperationNode): node is DeleteQueryNode {
    return node.kind === 'DeleteQueryNode'
  },

  create(fromItems: OperationNode[], withNode?: WithNode): DeleteQueryNode {
    return freeze({
      kind: 'DeleteQueryNode',
      from: FromNode.create(fromItems),
      ...(withNode && { with: withNode }),
    })
  },

  // TODO: remove in v0.29
  /**
   * @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
   */
  cloneWithOrderByItems: (
    node: DeleteQueryNode,
    items: ReadonlyArray<OrderByItemNode>,
  ) => QueryNode.cloneWithOrderByItems(node, items),

  // TODO: remove in v0.29
  /**
   * @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
   */
  cloneWithoutOrderBy: (node: DeleteQueryNode) =>
    QueryNode.cloneWithoutOrderBy(node),

  cloneWithLimit(
    deleteNode: DeleteQueryNode,
    limit: LimitNode,
  ): DeleteQueryNode {
    return freeze({
      ...deleteNode,
      limit,
    })
  },

  cloneWithoutLimit(deleteNode: DeleteQueryNode): DeleteQueryNode {
    return freeze({
      ...deleteNode,
      limit: undefined,
    })
  },

  cloneWithUsing(
    deleteNode: DeleteQueryNode,
    tables: OperationNode[],
  ): DeleteQueryNode {
    return freeze({
      ...deleteNode,
      using:
        deleteNode.using !== undefined
          ? UsingNode.cloneWithTables(deleteNode.using, tables)
          : UsingNode.create(tables),
    })
  },
})
