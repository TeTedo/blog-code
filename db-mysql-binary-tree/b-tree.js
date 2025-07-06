class BTreeNode {
  constructor(isLeaf = true) {
    this.isLeaf = isLeaf;
    this.keys = [];
    this.children = [];
    this.next = null; // B+Tree를 위한 링크
  }
}

// B-Tree 구현
class BTree {
  constructor(degree = 3) {
    this.root = new BTreeNode(true);
    this.degree = degree;
    this.minKeys = Math.ceil(degree / 2) - 1;
    this.maxKeys = degree - 1;
  }

  // 노드 검색
  search(key) {
    return this._searchNode(this.root, key);
  }

  _searchNode(node, key) {
    let i = 0;

    // 키를 찾을 위치 찾기
    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }

    // 리프 노드에서 찾기
    if (node.isLeaf) {
      if (i < node.keys.length && node.keys[i] === key) {
        return node;
      }
      return null;
    }

    // 내부 노드에서 자식으로 이동
    return this._searchNode(node.children[i], key);
  }

  // 노드 삽입
  insert(key) {
    const root = this.root;

    // 루트가 가득 찬 경우
    if (root.keys.length === this.maxKeys) {
      const newRoot = new BTreeNode(false);
      newRoot.children.push(root);
      this._splitChild(newRoot, 0);
      this.root = newRoot;
    }

    this._insertNonFull(this.root, key);
  }

  _insertNonFull(node, key) {
    let i = node.keys.length - 1;

    // 리프 노드인 경우
    if (node.isLeaf) {
      while (i >= 0 && key < node.keys[i]) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      node.keys[i + 1] = key;
    } else {
      // 내부 노드인 경우
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      i++;

      if (node.children[i].keys.length === this.maxKeys) {
        this._splitChild(node, i);
        if (key > node.keys[i]) {
          i++;
        }
      }
      this._insertNonFull(node.children[i], key);
    }
  }

  _splitChild(parent, childIndex) {
    const child = parent.children[childIndex];
    const newNode = new BTreeNode(child.isLeaf);

    // 키 분할
    const midIndex = Math.floor(child.keys.length / 2);
    const midKey = child.keys[midIndex];

    // 오른쪽 노드에 키 이동
    for (let i = midIndex + 1; i < child.keys.length; i++) {
      newNode.keys.push(child.keys[i]);
    }
    child.keys = child.keys.slice(0, midIndex);

    // 자식 노드 분할 (내부 노드인 경우)
    if (!child.isLeaf) {
      for (let i = midIndex + 1; i < child.children.length; i++) {
        newNode.children.push(child.children[i]);
      }
      child.children = child.children.slice(0, midIndex + 1);
    }

    // 부모 노드에 중간 키 삽입
    parent.keys.splice(childIndex, 0, midKey);
    parent.children.splice(childIndex + 1, 0, newNode);
  }

  // 범위 검색
  rangeSearch(minKey, maxKey) {
    const result = [];
    this._rangeSearchNode(this.root, minKey, maxKey, result);
    return result;
  }

  _rangeSearchNode(node, minKey, maxKey, result) {
    let i = 0;

    // 현재 노드의 키들 확인
    while (i < node.keys.length) {
      if (node.isLeaf) {
        if (node.keys[i] >= minKey && node.keys[i] <= maxKey) {
          result.push(node.keys[i]);
        }
      } else {
        // 내부 노드인 경우 자식으로 재귀
        if (i === 0 || node.keys[i - 1] < minKey) {
          this._rangeSearchNode(node.children[i], minKey, maxKey, result);
        }
      }
      i++;
    }

    // 마지막 자식 확인
    if (!node.isLeaf) {
      this._rangeSearchNode(node.children[i], minKey, maxKey, result);
    }
  }

  // 트리 시각화
  visualize() {
    console.log("=== B-Tree 구조 ===");
    this._printTree(this.root, "", true);
  }

  _printTree(node, prefix, isLeft) {
    if (node) {
      const nodeStr = `[${node.keys.join(",")}]`;
      console.log(prefix + (isLeft ? "└── " : "┌── ") + nodeStr);

      if (!node.isLeaf) {
        for (let i = 0; i < node.children.length; i++) {
          const childPrefix = prefix + (isLeft ? "    " : "│   ");
          this._printTree(
            node.children[i],
            childPrefix,
            i === node.children.length - 1
          );
        }
      }
    }
  }

  // 모든 키를 정렬된 순서로 반환
  getAllKeys() {
    const result = [];
    this._inOrderTraversal(this.root, result);
    return result;
  }

  _inOrderTraversal(node, result) {
    if (node.isLeaf) {
      result.push(...node.keys);
    } else {
      for (let i = 0; i < node.children.length; i++) {
        this._inOrderTraversal(node.children[i], result);
        if (i < node.keys.length) {
          result.push(node.keys[i]);
        }
      }
    }
  }
}

module.exports = { BTree, BTreeNode };
