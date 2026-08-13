import sys, os
msg = sys.stdin.read().strip()
commit = os.environ.get("GIT_COMMIT", "")
mapping = {
    "b0923a9901be9e689d5163f539903696511025fd": "refactor: reorganize UI components and normalize design tokens for visual consistency",
    "3b5b6c3aa7b9a7cb3c28bee3d372f124c01bd069": "style: remove emoji icons from admin sidebar - improves cross-platform rendering compatibility",
    "2f92d796c2536613ad3159f5c752a71dcaa06d10": "fix: correct admin layout sidebar active states and responsive breakpoints",
    "d6fa821ab44fc1cb4e0457778806a87e19faf937": "fix: make customer dashboard fully responsive across mobile and tablet viewports",
    "0e4fa56df609e8670bfdf0d68e59546004e55fbf": "feat: complete admin orders and returns management panels with status update controls",
    "ca116f5ad9dfca4b26dbbcf296c59b4d9e808bfe": "fix: correct customer dashboard stat counters to use live API data instead of static values",
    "67abd7b746599d9889ffbed9d35f0f74a15a3831": "fix: resolve sidebar navigation highlight not updating on route change",
    "a294edde88e3822b7f96a2213c75fdb387c2df05": "style: refine customer dashboard card spacing, typography, and color consistency",
}
print(mapping.get(commit, msg))
