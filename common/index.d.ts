declare namespace Common {
  /**
   * Make this type nullable.
   */
  type Nullable<T> = T | null

  /**
   * Get the right most non-void thing.
   */
  type Specific<Left = void, Right = void> = Right extends void ? Left : Right

  /**
   * Make a read-only object props writable.
   */
  type Writeable<T> = { -readonly [P in keyof T]: T[P] }
}
