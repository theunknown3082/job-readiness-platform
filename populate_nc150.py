from datetime import UTC, datetime
from app.core.database import SessionLocal
from app.models.models import DifficultyLevel, Problem, User, UserProblemProgress, ProblemStatus

NC150_PROBLEMS = [
    # --- ARRAYS & HASHING (9) ---
    {"title": "Contains Duplicate", "category": "Arrays & Hashing", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/contains-duplicate/"},
    {"title": "Valid Anagram", "category": "Arrays & Hashing", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/valid-anagram/"},
    {"title": "Two Sum", "category": "Arrays & Hashing", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/two-sum/"},
    {"title": "Group Anagrams", "category": "Arrays & Hashing", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/group-anagrams/"},
    {"title": "Top K Frequent Elements", "category": "Arrays & Hashing", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/top-k-frequent-elements/"},
    {"title": "Product of Array Except Self", "category": "Arrays & Hashing", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/product-of-array-except-self/"},
    {"title": "Valid Sudoku", "category": "Arrays & Hashing", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/valid-sudoku/"},
    {"title": "Encode and Decode Strings", "category": "Arrays & Hashing", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/encode-and-decode-strings/"},
    {"title": "Longest Consecutive Sequence", "category": "Arrays & Hashing", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/longest-consecutive-sequence/"},

    # --- TWO POINTERS & SLIDING WINDOW (24) ---
    {"title": "Valid Palindrome", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/valid-palindrome/"},
    {"title": "Two Sum II Input Array Is Sorted", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/"},
    {"title": "3Sum", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/3sum/"},
    {"title": "Container With Most Water", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/container-with-most-water/"},
    {"title": "Trapping Rain Water", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/trapping-rain-water/"},
    {"title": "Best Time to Buy and Sell Stock", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"},
    {"title": "Longest Substring Without Repeating Characters", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/"},
    {"title": "Longest Repeating Character Replacement", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/longest-repeating-character-replacement/"},
    {"title": "Permutation in String", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/permutation-in-string/"},
    {"title": "Minimum Window Substring", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/minimum-window-substring/"},
    {"title": "Sliding Window Maximum", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/sliding-window-maximum/"},
    {"title": "Binary Search", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/binary-search/"},
    {"title": "Search a 2D Matrix", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/search-a-2d-matrix/"},
    {"title": "Koko Eating Bananas", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/koko-eating-bananas/"},
    {"title": "Find Minimum in Rotated Sorted Array", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"},
    {"title": "Search in Rotated Sorted Array", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/search-in-rotated-sorted-array/"},
    {"title": "Time Based Key-Value Store", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/time-based-key-value-store/"},
    {"title": "Median of Two Sorted Arrays", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/median-of-two-sorted-arrays/"},
    {"title": "Insert Interval", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/insert-interval/"},
    {"title": "Merge Intervals", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/merge-intervals/"},
    {"title": "Non-overlapping Intervals", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/non-overlapping-intervals/"},
    {"title": "Meeting Rooms", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/meeting-rooms/"},
    {"title": "Meeting Rooms II", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/meeting-rooms-ii/"},
    {"title": "Minimum Interval to Include Each Query", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/minimum-interval-to-include-each-query/"},

    # --- TREES & GRAPHS (44) ---
    {"title": "Invert Binary Tree", "category": "Trees & Graphs", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/invert-binary-tree/"},
    {"title": "Maximum Depth of Binary Tree", "category": "Trees & Graphs", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/maximum-depth-of-binary-tree/"},
    {"title": "Diameter of Binary Tree", "category": "Trees & Graphs", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/diameter-of-binary-tree/"},
    {"title": "Balanced Binary Tree", "category": "Trees & Graphs", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/balanced-binary-tree/"},
    {"title": "Same Tree", "category": "Trees & Graphs", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/same-tree/"},
    {"title": "Subtree of Another Tree", "category": "Trees & Graphs", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/subtree-of-another-tree/"},
    {"title": "Lowest Common Ancestor of a BST", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"},
    {"title": "Binary Tree Level Order Traversal", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/binary-tree-level-order-traversal/"},
    {"title": "Binary Tree Right Side View", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/binary-tree-right-side-view/"},
    {"title": "Count Good Nodes in Binary Tree", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/count-good-nodes-in-binary-tree/"},
    {"title": "Validate Binary Search Tree", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/validate-binary-search-tree/"},
    {"title": "Kth Smallest Element in a BST", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/"},
    {"title": "Construct Binary Tree from Preorder and Inorder Traversal", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"},
    {"title": "Binary Tree Maximum Path Sum", "category": "Trees & Graphs", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/binary-tree-maximum-path-sum/"},
    {"title": "Serialize and Deserialize Binary Tree", "category": "Trees & Graphs", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"},
    {"title": "Implement Trie Prefix Tree", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/implement-trie-prefix-tree/"},
    {"title": "Design Add and Search Words Data Structure", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/design-add-and-search-words-data-structure/"},
    {"title": "Word Search II", "category": "Trees & Graphs", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/word-search-ii/"},
    {"title": "Kth Largest Element in a Stream", "category": "Trees & Graphs", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/kth-largest-element-in-a-stream/"},
    {"title": "Last Stone Weight", "category": "Trees & Graphs", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/last-stone-weight/"},
    {"title": "K Closest Points to Origin", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/k-closest-points-to-origin/"},
    {"title": "Kth Largest Element in an Array", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/kth-largest-element-in-an-array/"},
    {"title": "Task Scheduler", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/task-scheduler/"},
    {"title": "Find Median from Data Stream", "category": "Trees & Graphs", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/find-median-from-data-stream/"},
    {"title": "Number of Islands", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/number-of-islands/"},
    {"title": "Clone Graph", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/clone-graph/"},
    {"title": "Max Area of Island", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/max-area-of-island/"},
    {"title": "Pacific Atlantic Water Flow", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/pacific-atlantic-water-flow/"},
    {"title": "Surrounded Regions", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/surrounded-regions/"},
    {"title": "Rotting Oranges", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/rotting-oranges/"},
    {"title": "Walls and Gates", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/walls-and-gates/"},
    {"title": "Course Schedule", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/course-schedule/"},
    {"title": "Course Schedule II", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/course-schedule-ii/"},
    {"title": "Redundant Connection", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/redundant-connection/"},
    {"title": "Number of Connected Components in an Undirected Graph", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/"},
    {"title": "Graph Valid Tree", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/graph-valid-tree/"},
    {"title": "Word Ladder", "category": "Trees & Graphs", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/word-ladder/"},
    {"title": "Reconstruct Itinerary", "category": "Trees & Graphs", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/reconstruct-itinerary/"},
    {"title": "Min Cost to Connect All Points", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/min-cost-to-connect-all-points/"},
    {"title": "Network Delay Time", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/network-delay-time/"},
    {"title": "Swim in Rising Water", "category": "Trees & Graphs", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/swim-in-rising-water/"},
    {"title": "Alien Dictionary", "category": "Trees & Graphs", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/alien-dictionary/"},
    {"title": "Cheapest Flights Within K Stops", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/cheapest-flights-within-k-stops/"},

    # --- DYNAMIC PROGRAMMING & GREEDY (47) ---
    {"title": "Climbing Stairs", "category": "Dynamic Programming", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/climbing-stairs/"},
    {"title": "Min Cost Climbing Stairs", "category": "Dynamic Programming", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/min-cost-climbing-stairs/"},
    {"title": "House Robber", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/house-robber/"},
    {"title": "House Robber II", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/house-robber-ii/"},
    {"title": "Longest Palindromic Substring", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/longest-palindromic-substring/"},
    {"title": "Palindromic Substrings", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/palindromic-substrings/"},
    {"title": "Decode Ways", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/decode-ways/"},
    {"title": "Coin Change", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/coin-change/"},
    {"title": "Maximum Product Subarray", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/maximum-product-subarray/"},
    {"title": "Word Break", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/word-break/"},
    {"title": "Longest Increasing Subsequence", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/longest-increasing-subsequence/"},
    {"title": "Partition Equal Subset Sum", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/partition-equal-subset-sum/"},
    {"title": "Unique Paths", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/unique-paths/"},
    {"title": "Longest Common Subsequence", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/longest-common-subsequence/"},
    {"title": "Best Time to Buy and Sell Stock with Cooldown", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/"},
    {"title": "Coin Change II", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/coin-change-ii/"},
    {"title": "Target Sum", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/target-sum/"},
    {"title": "Interleaving String", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/interleaving-string/"},
    {"title": "Longest Increasing Path in a Matrix", "category": "Dynamic Programming", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/"},
    {"title": "Distinct Subsequences", "category": "Dynamic Programming", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/distinct-subsequences/"},
    {"title": "Edit Distance", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/edit-distance/"},
    {"title": "Burst Balloons", "category": "Dynamic Programming", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/burst-balloons/"},
    {"title": "Regular Expression Matching", "category": "Dynamic Programming", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/regular-expression-matching/"},
    {"title": "Subsets", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/subsets/"},
    {"title": "Combination Sum", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/combination-sum/"},
    {"title": "Permutations", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/permutations/"},
    {"title": "Subsets II", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/subsets-ii/"},
    {"title": "Combination Sum II", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/combination-sum-ii/"},
    {"title": "Word Search", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/word-search/"},
    {"title": "Palindrome Partitioning", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/palindrome-partitioning/"},
    {"title": "Letter Combinations of a Phone Number", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/"},
    {"title": "N-Queens", "category": "Dynamic Programming", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/n-queens/"},
    {"title": "Maximum Subarray", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/maximum-subarray/"},
    {"title": "Jump Game", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/jump-game/"},
    {"title": "Jump Game II", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/jump-game-ii/"},
    {"title": "Gas Station", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/gas-station/"},
    {"title": "Hand of Straights", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/hand-of-straights/"},
    {"title": "Merge Triplets to Form Target Triplet", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/"},
    {"title": "Partition Labels", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/partition-labels/"},
    {"title": "Valid Parenthesis String", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/valid-parenthesis-string/"},
    {"title": "Single Number", "category": "Dynamic Programming", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/single-number/"},
    {"title": "Number of 1 Bits", "category": "Dynamic Programming", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/number-of-1-bits/"},
    {"title": "Counting Bits", "category": "Dynamic Programming", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/counting-bits/"},
    {"title": "Reverse Bits", "category": "Dynamic Programming", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/reverse-bits/"},
    {"title": "Missing Number", "category": "Dynamic Programming", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/missing-number/"},
    {"title": "Sum of Two Integers", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/sum-of-two-integers/"},
    {"title": "Reverse Integer", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/reverse-integer/"},

    # --- SYSTEM DESIGN & DB (26) ---
    {"title": "Valid Parentheses", "category": "System Design & DB", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/valid-parentheses/"},
    {"title": "Min Stack", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/min-stack/"},
    {"title": "Evaluate Reverse Polish Notation", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/evaluate-reverse-polish-notation/"},
    {"title": "Generate Parentheses", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/generate-parentheses/"},
    {"title": "Daily Temperatures", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/daily-temperatures/"},
    {"title": "Car Fleet", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/car-fleet/"},
    {"title": "Largest Rectangle in Histogram", "category": "System Design & DB", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/largest-rectangle-in-histogram/"},
    {"title": "Reverse Linked List", "category": "System Design & DB", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/reverse-linked-list/"},
    {"title": "Merge Two Sorted Lists", "category": "System Design & DB", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/merge-two-sorted-lists/"},
    {"title": "Reorder List", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/reorder-list/"},
    {"title": "Remove Nth Node From End of List", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"},
    {"title": "Copy List with Random Pointer", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/copy-list-with-random-pointer/"},
    {"title": "Add Two Numbers", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/add-two-numbers/"},
    {"title": "Linked List Cycle", "category": "System Design & DB", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/linked-list-cycle/"},
    {"title": "Find the Duplicate Number", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/find-the-duplicate-number/"},
    {"title": "LRU Cache", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/lru-cache/"},
    {"title": "Merge k Sorted Lists", "category": "System Design & DB", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/merge-k-sorted-lists/"},
    {"title": "Reverse Nodes in k-Group", "category": "System Design & DB", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/reverse-nodes-in-k-group/"},
    {"title": "Design Twitter", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/design-twitter/"},
    {"title": "Rotate Image", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/rotate-image/"},
    {"title": "Spiral Matrix", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/spiral-matrix/"},
    {"title": "Set Matrix Zeroes", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/set-matrix-zeroes/"},
    {"title": "Happy Number", "category": "System Design & DB", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/happy-number/"},
    {"title": "Plus One", "category": "System Design & DB", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/plus-one/"},
    {"title": "Pow(x, n)", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/powx-n/"},
    {"title": "Multiply Strings", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/multiply-strings/"},
    {"title": "Detect Squares", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/detect-squares/"},
]

def populate_database():
    db = SessionLocal()
    try:
        inserted_count = 0
        for prob_data in NC150_PROBLEMS:
            existing = db.query(Problem).filter(Problem.title == prob_data["title"]).first()
            if not existing:
                db.add(Problem(**prob_data))
                inserted_count += 1
            else:
                existing.category = prob_data["category"]
                existing.difficulty = prob_data["difficulty"]
                existing.source_url = prob_data["source_url"]

        db.commit()
        total = db.query(Problem).count()
        print(f"Successfully populated NeetCode 150 catalog. Inserted: {inserted_count}, Total Problems in DB: {total}")
    except Exception as e:
        db.rollback()
        print(f"Error populating database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    populate_database()
