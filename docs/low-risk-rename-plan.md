# 低风险命名重构计划

## 目标

先修复会影响运行时稳定性的 `Route` key，再为当前几处命名不一致路径提供一份低风险、可分批执行的重命名计划。

## 本轮已完成

- `src/router/router_view.tsx`
  - 已把 `Route` / `Redirect` 的 `key` 从索引改为基于路径的稳定 key，避免路由数组顺序变化导致无意义 remount。

## 建议重命名清单

| 当前路径 | 建议目标 | 当前引用面 | 建议 |
| --- | --- | --- | --- |
| `src/router/router_view.tsx` | `src/router/router-view.tsx` | 4 处直接 import | 可改，但属于“改文件名 + 改 import”的批量动作，建议单独一次提交完成 |
| `src/reset_style` | `src/reset-style` | 1 处直接 import | 低风险，适合和 `router_view.tsx` 一起处理 |
| `src/utils/createName` | `src/utils/create-name` | 1 处直接 import + 1 处赋值使用 | 低风险，适合本轮后续单独处理 |
| `src/store/userPreferences` | `src/store/user-preferences` | 2 处直接 import + 多处 `state.userPreferences` 语义字段 | 目录名可改，但 Redux slice 名、persist key、state 字段不建议本轮联动修改 |
| `src/api/Baseurl` | `src/api/base-url` | 当前无活跃 import，仅目录自身定义 | 风险最低；若确认未来不用，也可直接转为删除候选 |

## 推荐顺序

1. `router_view.tsx` → `router-view.tsx`
   - 原因：当前已修稳定 key，文件职责清晰，直接 import 点也少。
2. `reset_style` → `reset-style`
   - 原因：只有入口样式引用，改动面最小。
3. `createName` → `create-name`
   - 原因：仅 `App.tsx` 使用，回归验证成本低。
4. `Baseurl` → `base-url`
   - 原因：当前无活跃引用，最适合先做“确认是否保留”的清理判断。
5. `userPreferences` → `user-preferences`
   - 原因：虽然 import 点不多，但它关联 store 持久化、slice name、状态字段语义，应该单独处理并明确“只改目录名，不改 state key”。

## 执行边界

- 本轮不直接大规模改目录名，只完成稳定 key 修复并沉淀计划。
- `userPreferences` 本轮只建议改目录路径，不建议同步改这些运行时标识：
  - slice `name: 'userPreferences'`
  - persist `key: 'userPreferences'`
  - store state 字段 `state.userPreferences`
- `Baseurl` 如果后续确认仍无引用，优先考虑删除而不是重命名。

## 验证建议

每次实际执行某一项重命名后，都执行：

```bash
pnpm exec tsc --noEmit
pnpm build
```
