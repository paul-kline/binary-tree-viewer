export default class BinTree<T> {
  left: BinTree<T> | null;
  right: BinTree<T> | null;
  val: T;
  compareFn: (a: T, b: T) => number = (a, b) => (a > b ? 1 : a < b ? -1 : 0);
  public static compareFnFromType<T>(val: T) {
    if (typeof val == "number") {
      //currently the default;
      console.log("using num compare)");
      return (a: number, b: number) => a - b;
    } else if (typeof val == "string") {
      console.log("I think this is a string", val);
      return (a: string, b: string) => a.localeCompare(b);
    }
  }
  constructor(val: T, left: BinTree<T> | null, right: BinTree<T> | null, compareFn?: (a: T, b: T) => number) {
    this.val = val;
    this.left = left;
    this.right = right;
    if (compareFn) {
      this.compareFn = compareFn;
    } else {
      this.compareFn = BinTree.compareFnFromType(val) as any;
    }
  }
  removeLeftMost(): BinTree<T> {
    if (this.left) {
      const leftChild: BinTree<T> = this.left;
      if (!leftChild.left) {
        //then I am the parent of the chosen one. set my new left child since it's moving away.
        this.left = leftChild.right ? leftChild.right : null;
        return leftChild;
      } else {
        //leftchild has its own child. not my problem.
        return leftChild.removeLeftMost();
      }
    } else {
      console.log("uhoh, there wasn't a first left!");
      return this;
    }
  }
  delete(t: T, modifyParent?: (bn: BinTree<T> | null) => any): BinTree<T> {
    const v = this.compareFn(t, this.val);
    console.log("comparing", this.val, t, this);
    if (v == 0) {
      //then delete it.
      if (this.isLeaf) {
        //then set parent ref to null;
        if (modifyParent) {
          modifyParent(null);
        } else {
          console.log("function was false", modifyParent);
        }
      } else if (this.onlyLeft) {
        if (modifyParent) {
          modifyParent(this.left);
        }
      } else if (this.onlyRight) {
        if (modifyParent) {
          modifyParent(this.right);
        }
      } else {
        console.log("deleting internal node");
        //it is an internal node:
        //it must have a next greater then which is the leftmost of the right tree.
        if (!this.right) {
          throw new Error("unexpected nonsense");
        }
        const node = this.right.removeLeftMost();
        //node's right will take its place in parent.
        if (modifyParent) {
          //inform the parent of the new child which was leftmost.
          modifyParent(node);
        }
        node.left = this.left;
        if (node != this.right) {
          //only if the right had a child, set new.
          node.right = this.right;
        }
        return node;
      }
      return this;
    } else if (v < 0) {
      if (this.left) {
        return this.left.delete(t, b => (this.left = b));
      } else {
        //this element isn't here.
        return this;
      }
    } else {
      //v > 0
      if (this.right) {
        return this.right.delete(t, b => (this.right = b));
      } else {
        return this;
      }
    }
  }
  insert(t: T) {
    const v = this.compareFn(t, this.val);
    if (v <= 0) {
      if (this.left) {
        this.left.insert(t);
      } else {
        this.left = new BinTree(t, null, null, this.compareFn);
      }
    } else {
      //it's greater
      if (this.right) {
        this.right.insert(t);
      } else {
        this.right = new BinTree(t, null, null, this.compareFn);
      }
    }
  }
  _insert(t: T): any {
    const v = this.compareFn(t, this.val);
    //negative go left. positive go right. 0 we are the same.
    if (v < 0) {
      if (!this.left) {
        this.left = new BinTree(t, null, null);
      } else {
        //left exists
        // const v = this.compareFn(t, this.left.val);
        // if (v < 0) {
        return this.left.insert(t);
        // } else {
        //   this.left = new BinTree(t, this.left, null);
        // }
      }
    } else if (v > 0) {
      if (!this.right) {
        this.right = new BinTree(t, null, null);
      } else {
        // const v = this.compareFn(t, this.right.val);
        // if (v > 0) {
        //right exists and the value belongs in its tree.
        return this.right.insert(t);
        // } else {
        //it's equal or belongs here.
        //   this.right = new BinTree(t, null, this.right);
        // }
      }
    } else {
      //they are equal.
      if (this.onlyRight) {
        console.log("onlyright existed");
        this.left = new BinTree(t, null, null);
      } else if (this.onlyLeft) {
        console.log("only left existed");
        this.right = new BinTree(t, null, null);
      } else {
        if (!this.left) {
          //maybe they were both null. choose left becuase I am left handed.
          console.log("both were null");
          this.left = new BinTree(t, null, null);
        } else {
          console.log("left wasn't null so inserting myself between");
          //choose left because I am left handed.
          this.left = new BinTree(t, this.left, null);
        }
      }
    }
  }
  get isLeaf() {
    return this.left == null && this.right == null;
  }

  get onlyLeft() {
    return this.left && !this.right;
  }
  get onlyRight() {
    return this.right && !this.left;
  }
  public size(): number {
    const lv = this.left ? this.left.size() : 0;
    const rv = this.right ? this.right.size() : 0;
    return 1 + lv + rv;
  }
  public maxDepth(): number {
    const ld = this.left ? this.left.maxDepth() : 0;
    const rd = this.right ? this.right.maxDepth() : 0;
    return 1 + Math.max(ld, rd);
  }
  public minValue(): T {
    if (this.left) {
      return this.left.minValue();
    } else {
      return this.val;
    }
  }
  public maxValue(): T {
    if (this.right) {
      return this.right.maxValue();
    } else {
      return this.val;
    }
  }
  public leftRotation(t: T) {
    const v = this.compareFn(t, this.val);
    let child = null;
    if (v < 0) {
      //look for this value to the left.
      child = this.left;
    } else if (v > 0) {
      //look for it to the right.
      child = this.right;
    } else {
      throw new Error("isn't supposed to be me aka top node.");
    }
    if(child && child.compareFn(t,child.val) == 0){
      //must rotate child!
      if(v < 0){
        this.left = child.right;
        
      }
    }
    
  }
  public toList(lvl: number = 0, ls: T[][] = []): T[] {
    if (ls && !ls[lvl]) {
      ls[lvl] = [];
    }
    ls[lvl].push(this.val);
    if (this.left) {
      this.left.toList(lvl + 1, ls);
    }
    if (this.right) {
      this.right.toList(lvl + 1, ls);
    }

    return ls.flat();
    // const larr = this.left ? this.left.toList() : [];
    // const rarr = this.right ? this.right.toList() : [];
    // larr.push(this.val);
    // return larr.concat(rarr);
  }
  public isBalanced(): boolean {
    const ldepth = this.left ? this.left.maxDepth() : 0;
    const rdepth = this.right ? this.right.maxDepth() : 0;
    return (
      Math.abs(ldepth - rdepth) < 2 &&
      (this.left ? this.left.isBalanced() : true) &&
      (this.right ? this.right.isBalanced() : true)
    );
  }
  private _isBalanced(n: number) {}
  public isBST(lt: T | null, gt: T | null): boolean {
    const thisone = (lt ? this.compareFn(this.val, lt) <= 0 : true) && (gt ? this.compareFn(this.val, gt) >= 0 : true);
    return (
      thisone &&
      (this.left ? this.left.isBST(this.val, gt) : true) &&
      (this.right ? this.right.isBST(lt, this.val) : true)
    );
  }

  public static fromList<T>(ls: T[], compareFn?: (a: T, b: T) => number): BinTree<T> | null {
    if (!ls || ls.length == 0) {
      return null;
    }
    const head = new BinTree(ls[0], null, null, compareFn);
    ls.slice(1).forEach(t => head.insert(t));
    return head;
  }
  public static fromListSort<T>(ls: T[], compareFn?: (a: T, b: T) => number): BinTree<T> | null {
    // if (compareFn) {
    //   this.compareFn = compareFn;
    // }
    if (!compareFn) {
      compareFn = BinTree.compareFnFromType(ls[0]) as any;
    }
    const sorted = ls.sort(compareFn);
    const fromListHelper = (ls: T[]): BinTree<T> | null => {
      if (!ls || ls.length == 0) {
        return null;
      }
      //assume sorted.
      const middleI = Math.floor(ls.length / 2);
      const leftls = ls.slice(0, middleI);
      const rightls = ls.slice(middleI + 1);
      return new BinTree(ls[middleI], fromListHelper(leftls), fromListHelper(rightls), compareFn);
    };
    return fromListHelper(sorted);
  }
}
