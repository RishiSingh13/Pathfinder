const dsaRoadmap = {
  title: 'Data Structures & Algorithms',
  slug: 'dsa',
  outcome: 'Master foundational computer science structures, algorithmic patterns, and high-frequency technical interview problem solving.',
  level: 'Beginner',
  prerequisites: ['Basic familiarity with at least one programming language (Python, JavaScript, C++, or Java)', 'Basic high school algebra'],
  estimatedHours: 48,
  weeklyPaceHours: 6,
  orderedPhaseTitles: ['Phase 1: Foundations', 'Phase 2: Core Data Structures', 'Phase 3: Algorithmic Techniques', 'Phase 4: Advanced Structures'],
  status: 'published',
  curator: 'Arjun Mehta (Lead Systems Engineer & Mentor)',
  lastReviewedDate: '2025-01-15',
  intendedAudience: 'Software engineers preparing for technical interviews, CS undergraduates, and self-taught developers seeking structured algorithmic foundations.',
  whatIsOutOfScope: ['Language-specific compiler optimizations', 'Advanced competitive programming esoteric algorithms (FFT, Fenwick 2D)', 'Hardware architecture'],
  resourceMix: ['Visualizations', 'Official Documentation', 'Interactive Tutorials', 'Drills'],
  languages: ['English'],
  sampleTopicKey: 'arrays-and-strings',
  modules: [
    {
      title: 'Algorithmic Foundations',
      phaseLabel: 'Phase 1: Foundations',
      order: 1,
      description: 'Understanding computational complexity, memory representation, and fundamental primitives.',
      topics: [
        {
          title: 'Asymptotic Analysis & Big-O Notation',
          key: 'complexity-analysis',
          order: 1,
          type: 'core',
          estimatedMinutes: 45,
          buildsOnNote: 'Prerequisite for evaluating all subsequent data structure operations and algorithms.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Analyze worst-case, average-case, and best-case time complexity.',
            'Calculate auxiliary space complexity in iterative and recursive algorithms.',
            'Differentiate between O(1), O(log n), O(n), O(n log n), and O(n²).'
          ],
          resources: [
            {
              type: 'Article & Cheatsheet',
              title: 'Big-O Cheat Sheet & Complexity Guide',
              url: 'https://www.bigocheatsheet.com/',
              source: 'Big-O Cheat Sheet',
              duration: '20 mins',
              language: 'English',
              level: 'Beginner',
              role: 'primary',
              reason: 'Clear comparative charts showing operation complexities across standard structures.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Interactive Guide',
              title: 'Khan Academy: Asymptotic Notation',
              url: 'https://www.khanacademy.org/computing/computer-science/algorithms/asymptotic-notation/a/asymptotic-notation',
              source: 'Khan Academy Algorithms',
              duration: '25 mins',
              language: 'English',
              level: 'Beginner',
              role: 'alternate',
              reason: 'Mathematical intuition explained with friendly step-by-step proofs.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Reference',
              title: 'MIT 6.006 Lecture Notes: Asymptotic Complexity',
              url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
              source: 'MIT OpenCourseWare',
              duration: '35 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'optional_reading',
              reason: 'Rigorous academic foundations for deep understanding.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Big-O Calculation Drill: Loop Invariants',
              description: 'Calculate Big-O time and space complexity for nested loops with variable step sizes.',
              type: 'Conceptual Challenge',
              difficulty: 'Easy',
              url: 'https://www.geeksforgeeks.org/dsa/practice-questions-time-complexity-analysis/'
            },
            {
              title: 'Space Complexity in Recursion Call Stacks',
              description: 'Determine the maximum call-stack depth for linear vs binary recursion.',
              type: 'Conceptual Challenge',
              difficulty: 'Medium',
              url: 'https://www.geeksforgeeks.org/dsa/g-fact-86/'
            },
            {
              title: 'Asymptotic Analysis Quiz',
              description: 'Test your understanding of lower and upper asymptotic bounds.',
              type: 'Drill',
              difficulty: 'Easy',
              url: 'https://www.geeksforgeeks.org/quizzes/analysis-of-algorithms-gq/'
            }
          ]
        },
        {
          title: 'Arrays & Dynamic Strings',
          key: 'arrays-and-strings',
          order: 2,
          type: 'core',
          estimatedMinutes: 50,
          buildsOnNote: 'Builds directly on memory locality and O(1) random indexing concepts.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Understand contiguous memory allocation and amortized resizing in dynamic arrays.',
            'Master in-place array manipulation without allocating auxiliary arrays.',
            'Handle character encoding, string immutability, and boundary conditions.'
          ],
          resources: [
            {
              type: 'Guide',
              title: 'Arrays & Dynamic Arrays in Depth',
              url: 'https://runestone.academy/ns/books/published/pythonds/BasicDS/TheArrayDataStructure.html',
              source: 'Runestone Interactive',
              duration: '25 mins',
              language: 'English',
              level: 'Beginner',
              role: 'primary',
              reason: 'Visual breakdown of amortized cost and contiguous indexing memory layout.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Documentation',
              title: 'MDN Web Docs: Array Methods & Memory representation',
              url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
              source: 'MDN Web Docs',
              duration: '20 mins',
              language: 'English',
              level: 'Beginner',
              role: 'alternate',
              reason: 'Practical developer reference for built-in transformations and mutations.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Contains Duplicate',
              description: 'Determine if an array contains any duplicates using set lookup.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/contains-duplicate/'
            },
            {
              title: 'Valid Anagram',
              description: 'Compare character frequencies between two strings in O(n) time.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/valid-anagram/'
            },
            {
              title: 'Concatenation of Array',
              description: 'Build a duplicate concatenated array with index arithmetic.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/concatenation-of-array/'
            },
            {
              title: 'String Compression',
              description: 'Compress consecutive repeating characters in-place using two pointers.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/string-compression/'
            }
          ]
        },
        {
          title: 'Hashing & Hash Tables',
          key: 'hashing-and-hash-tables',
          order: 3,
          type: 'core',
          estimatedMinutes: 60,
          buildsOnNote: 'Extends array random access with hash functions to achieve average O(1) lookups.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Understand hash functions, collisions, and resolution strategies (separate chaining, open addressing).',
            'Recognize the trade-off between load factor and lookup performance.',
            'Use hash maps and hash sets to reduce O(n²) pair comparisons to O(n).'
          ],
          resources: [
            {
              type: 'Interactive Article',
              title: 'How Hash Tables Work Under the Hood',
              url: 'https://en.wikipedia.org/wiki/Hash_table',
              source: 'Wikipedia & Interactive Computer Science',
              duration: '30 mins',
              language: 'English',
              level: 'Beginner',
              role: 'primary',
              reason: 'Exhaustive explanation of collision handling, probing methods, and worst-case vs amortized analysis.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Guide',
              title: 'BaseCS: Taking Hash Tables Off The Shelf',
              url: 'https://medium.com/basecs/taking-hash-tables-off-the-shelf-139cbf4752f0',
              source: 'BaseCS by Vaidehi Joshi',
              duration: '20 mins',
              language: 'English',
              level: 'Beginner',
              role: 'alternate',
              reason: 'Hand-drawn visual explanations that demystify hashing mechanics effortlessly.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Two Sum',
              description: 'Find two indices that sum to target using a complementary hash map in one pass.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/two-sum/'
            },
            {
              title: 'Group Anagrams',
              description: 'Group words with identical letter counts using sorted strings or tuple keys.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/group-anagrams/'
            },
            {
              title: 'Top K Frequent Elements',
              description: 'Find the most frequent numbers using frequency buckets or map counts.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/top-k-frequent-elements/'
            }
          ]
        },
        {
          title: 'Recursion Fundamentals',
          key: 'recursion-basics',
          order: 4,
          type: 'core',
          estimatedMinutes: 55,
          buildsOnNote: 'Foundational concept required for linked list traversals, trees, and dynamic programming.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Identify base cases and recursive decomposition steps.',
            'Trace call stack growth and understand stack overflow risks.',
            'Formulate recurrence relations for time and space analysis.'
          ],
          resources: [
            {
              type: 'Interactive Tutorial',
              title: 'Understanding Recursion: Visualizing Call Stacks',
              url: 'https://pythontutor.com/',
              source: 'PythonTutor / Visual Execution',
              duration: '25 mins',
              language: 'English',
              level: 'Beginner',
              role: 'primary',
              reason: 'Visual step-by-step frame inspector for active call stacks.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Guide',
              title: 'GeeksforGeeks: Recursion Demystified',
              url: 'https://www.geeksforgeeks.org/introduction-to-recursion-data-structure-and-algorithm-tutorials/',
              source: 'GeeksforGeeks',
              duration: '20 mins',
              language: 'English',
              level: 'Beginner',
              role: 'alternate',
              reason: 'Clear progression from tail recursion to tree recursion examples.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Reverse String (Recursive)',
              description: 'Reverse an array of characters in-place using tail recursion.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/reverse-string/'
            },
            {
              title: 'Fibonacci Number',
              description: 'Compute the nth Fibonacci number and observe recursive redundant evaluations.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/fibonacci-number/'
            },
            {
              title: 'Pow(x, n) (Binary Exponentiation)',
              description: 'Calculate x raised to power n in O(log n) recursive time.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/powx-n/'
            }
          ]
        }
      ]
    },
    {
      title: 'Core Data Structures',
      phaseLabel: 'Phase 2: Core Data Structures',
      order: 2,
      description: 'Pointer-based dynamic structures: Linked Lists, Stacks, Queues, Binary Trees, and Heaps.',
      topics: [
        {
          title: 'Singly & Doubly Linked Lists',
          key: 'linked-lists',
          order: 5,
          type: 'core',
          estimatedMinutes: 60,
          buildsOnNote: 'Presents pointer manipulation contrast against contiguous array allocation.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Implement node insertion, deletion, and reversal without memory leaks.',
            'Master the dummy head technique to eliminate null boundary checks.',
            'Apply Floyd’s Tortoise and Hare cycle detection algorithm.'
          ],
          resources: [
            {
              type: 'Interactive Visualizer',
              title: 'VisuAlgo: Linked List Data Structure',
              url: 'https://visualgo.net/en/list',
              source: 'VisuAlgo',
              duration: '25 mins',
              language: 'English',
              level: 'Beginner',
              role: 'primary',
              reason: 'Interactive animated pointer reassignments for append, insert, and delete.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Article',
              title: 'BaseCS: What’s a Linked List, Anyway?',
              url: 'https://medium.com/basecs/whats-a-linked-list-anyway-part-1-d8b7e6508b9d',
              source: 'BaseCS',
              duration: '20 mins',
              language: 'English',
              level: 'Beginner',
              role: 'alternate',
              reason: 'Intuitive analogies for memory nodes and references.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Reverse Linked List',
              description: 'Reverse a singly linked list in O(n) time and O(1) auxiliary space.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/reverse-linked-list/'
            },
            {
              title: 'Merge Two Sorted Lists',
              description: 'Splice together nodes of two sorted lists using dummy head technique.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/merge-two-sorted-lists/'
            },
            {
              title: 'Linked List Cycle',
              description: 'Detect whether a cycle exists using fast and slow pointers.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/linked-list-cycle/'
            },
            {
              title: 'Remove Nth Node From End of List',
              description: 'Remove node in single pass using two pointer gap interval.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/'
            }
          ]
        },
        {
          title: 'Stacks & Queues',
          key: 'stacks-and-queues',
          order: 6,
          type: 'core',
          estimatedMinutes: 50,
          buildsOnNote: 'Constrained abstract data types built on top of arrays or linked lists.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Contrast LIFO (Stack) and FIFO (Queue) access patterns and operation amortized costs.',
            'Evaluate nested bracket balancing and expression parsing.',
            'Apply monotonic stack patterns to solve next greater element queries in linear time.'
          ],
          resources: [
            {
              type: 'Tutorial',
              title: 'Stacks and Queues: Visual Guide & Applications',
              url: 'https://visualgo.net/en/list',
              source: 'VisuAlgo',
              duration: '20 mins',
              language: 'English',
              level: 'Beginner',
              role: 'primary',
              reason: 'Clear animations of push, pop, enqueue, and dequeue mechanics.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Article',
              title: 'Monotonic Stack Explained',
              url: 'https://leetcode.com/discuss/post/2347639/A-comprehensive-guide-and-template-for-monotonic-/',
              source: 'LeetCode Study Guides',
              duration: '30 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'alternate',
              reason: 'Comprehensive pattern breakdown for sliding windows and nearest element lookups.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Valid Parentheses',
              description: 'Validate syntax nesting of brackets using a stack.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/valid-parentheses/'
            },
            {
              title: 'Evaluate Reverse Polish Notation',
              description: 'Evaluate postfix arithmetic expressions with stack operand tracking.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/'
            },
            {
              title: 'Daily Temperatures',
              description: 'Find number of days until a warmer temperature using monotonic stack.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/daily-temperatures/'
            }
          ]
        },
        {
          title: 'Binary Trees & Binary Search Trees (BST)',
          key: 'trees-and-bst',
          order: 7,
          type: 'core',
          estimatedMinutes: 75,
          buildsOnNote: 'Combines recursive decomposition with linked pointer nodes.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Traverse trees using preorder, inorder, postorder (DFS), and level-order (BFS).',
            'Enforce BST invariants: left subtree < root < right subtree.',
            'Compute tree depth, diameter, and validate balanced trees.'
          ],
          resources: [
            {
              type: 'Interactive Visualizer',
              title: 'VisuAlgo: Binary Search Tree Invariants & Rotations',
              url: 'https://visualgo.net/en/bst',
              source: 'VisuAlgo',
              duration: '30 mins',
              language: 'English',
              level: 'Beginner',
              role: 'primary',
              reason: 'Step-by-step interactive animations of BST insert, search, and delete operations.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Guide',
              title: 'GeeksforGeeks: Comprehensive Tree Traversal Guide',
              url: 'https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/',
              source: 'GeeksforGeeks',
              duration: '25 mins',
              language: 'English',
              level: 'Beginner',
              role: 'alternate',
              reason: 'Contrasts iterative queue-based BFS against recursive stack-based DFS.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Invert Binary Tree',
              description: 'Swap left and right children recursively across all nodes.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/invert-binary-tree/'
            },
            {
              title: 'Maximum Depth of Binary Tree',
              description: 'Compute root-to-furthest-leaf node distance in O(n) time.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/'
            },
            {
              title: 'Validate Binary Search Tree',
              description: 'Verify if a tree satisfies global BST ordering using min/max boundaries.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/validate-binary-search-tree/'
            },
            {
              title: 'Binary Tree Level Order Traversal',
              description: 'Perform BFS traversal grouping nodes by level depth using a queue.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/'
            }
          ]
        },
        {
          title: 'Heaps & Priority Queues',
          key: 'heaps-priority-queues',
          order: 8,
          type: 'core',
          estimatedMinutes: 60,
          buildsOnNote: 'Complete binary tree layout backed by a zero-overhead contiguous array.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Understand heap-order invariant and parent-child array index relations (2i+1, 2i+2).',
            'Perform sift-up and sift-down operations in O(log n) time.',
            'Contrast linear O(n) heapify with O(n log n) sequential insertions.'
          ],
          resources: [
            {
              type: 'Interactive Visualizer',
              title: 'VisuAlgo: Binary Heap Visualizer',
              url: 'https://visualgo.net/en/heap',
              source: 'VisuAlgo',
              duration: '25 mins',
              language: 'English',
              level: 'Beginner',
              role: 'primary',
              reason: 'Interactive demonstration of bubble-up and bubble-down array index mapping.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Guide',
              title: 'BaseCS: Learning to Love Heaps',
              url: 'https://medium.com/basecs/learning-to-love-heaps-cef2b273a238',
              source: 'BaseCS',
              duration: '20 mins',
              language: 'English',
              level: 'Beginner',
              role: 'alternate',
              reason: 'Engaging illustrated walkthrough of priority queue design.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Kth Largest Element in an Array',
              description: 'Find kth largest element using a min-heap of size k in O(n log k).',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/'
            },
            {
              title: 'Last Stone Weight',
              description: 'Simulate stone smashing with max-heap priority queue updates.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/last-stone-weight/'
            },
            {
              title: 'Find Median from Data Stream',
              description: 'Maintain running median using balanced two-heap pattern (min-heap & max-heap).',
              type: 'Coding Exercise',
              difficulty: 'Hard',
              url: 'https://leetcode.com/problems/find-median-from-data-stream/'
            }
          ]
        }
      ]
    },
    {
      title: 'Algorithmic Problem-Solving Techniques',
      phaseLabel: 'Phase 3: Algorithmic Techniques',
      order: 3,
      description: 'High-frequency algorithmic paradigms: Two Pointers, Sliding Window, Dynamic Programming, and Greedy.',
      topics: [
        {
          title: 'Two Pointers & Sliding Window',
          key: 'two-pointers-sliding-window',
          order: 9,
          type: 'core',
          estimatedMinutes: 65,
          buildsOnNote: 'Optimizes quadratic subarray checks into linear scans over sorted or contiguous data.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Apply convergent two pointers on sorted arrays to reduce O(n²) to O(n).',
            'Construct dynamic sliding windows with expansion and contraction criteria.',
            'Maintain window state frequency counters efficiently.'
          ],
          resources: [
            {
              type: 'Pattern Guide',
              title: 'The Sliding Window Pattern Explained',
              url: 'https://www.baeldung.com/cs/sliding-window-algorithm',
              source: 'LeetCode Study Guides',
              duration: '30 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'primary',
              reason: 'Defines reusable code templates for fixed and variable size windows.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Article',
              title: 'Two Pointer Technique Overview',
              url: 'https://www.geeksforgeeks.org/two-pointers-technique/',
              source: 'GeeksforGeeks',
              duration: '20 mins',
              language: 'English',
              level: 'Beginner',
              role: 'alternate',
              reason: 'Comprehensive visual diagrams illustrating inward convergence.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Valid Palindrome',
              description: 'Check if alphanumeric string reads identically forward and backward using inward pointers.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/valid-palindrome/'
            },
            {
              title: '3Sum',
              description: 'Find unique triplets that sum to zero using sorting and two pointers in O(n²).',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/3sum/'
            },
            {
              title: 'Longest Substring Without Repeating Characters',
              description: 'Track seen character indices in dynamic sliding window.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
            },
            {
              title: 'Container With Most Water',
              description: 'Maximize boundary area using greedy inward two-pointer movement.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/container-with-most-water/'
            }
          ]
        },
        {
          title: 'Dynamic Programming Foundations',
          key: 'dynamic-programming',
          order: 10,
          type: 'core',
          estimatedMinutes: 85,
          buildsOnNote: 'Directly extends recursion by storing solutions to overlapping subproblems.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Recognize optimal substructure and overlapping subproblems.',
            'Transition top-down recursion with memoization to bottom-up tabulation.',
            'Optimize space complexity by rolling state variables.'
          ],
          resources: [
            {
              type: 'Guide & Visualizer',
              title: 'Demystifying Dynamic Programming',
              url: 'https://www.freecodecamp.org/news/demystifying-dynamic-programming-24fbdb831d3a/',
              source: 'freeCodeCamp',
              duration: '35 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'primary',
              reason: 'Step-by-step visual trees demonstrating redundant computation elimination.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Article',
              title: 'LeetCode DP Patterns Compendium',
              url: 'https://leetcode.com/discuss/study-guide/458695/Dynamic-Programming-Patterns',
              source: 'LeetCode Community',
              duration: '40 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'alternate',
              reason: 'Categorizes 0/1 knapsack, unbounded knapsack, and grid paths into standard templates.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Climbing Stairs',
              description: 'Determine distinct combinations to reach top using Fibonacci recurrence.',
              type: 'Coding Exercise',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/climbing-stairs/'
            },
            {
              title: 'Coin Change',
              description: 'Compute fewest coins needed to make amount using bottom-up tabulation.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/coin-change/'
            },
            {
              title: 'Longest Increasing Subsequence',
              description: 'Find length of strictly increasing subsequence in O(n²) or O(n log n).',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/longest-increasing-subsequence/'
            }
          ]
        },
        {
          title: 'Backtracking & Pruning',
          key: 'backtracking',
          order: 11,
          type: 'optional',
          estimatedMinutes: 70,
          buildsOnNote: 'State-space tree exploration with condition-based branch pruning.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Build candidate solutions incrementally and undo choices upon invalid paths.',
            'Distinguish permutations from combinations and subsets.',
            'Formulate constraint pruning to avoid exploring exponential fruitless paths.'
          ],
          resources: [
            {
              type: 'Tutorial',
              title: 'A General Approach to Backtracking Questions in Java/Python',
              url: 'https://leetcode.com/problems/subsets/solutions/27281/a-general-approach-to-backtracking-questions-in-java-subsets-permutations-combination-sum-palindrome-partitioning/',
              source: 'LeetCode Discuss',
              duration: '25 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'primary',
              reason: 'Legendary universal template unifying Subsets, Permutations, and Combination Sum.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Subsets',
              description: 'Generate power set of unique elements through inclusion/exclusion choices.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/subsets/'
            },
            {
              title: 'Combination Sum',
              description: 'Find unique combinations where candidate numbers sum to target.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/combination-sum/'
            },
            {
              title: 'Word Search',
              description: 'Explore 2D grid matrix with backtracking marker state restoration.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/word-search/'
            }
          ]
        }
      ]
    },
    {
      title: 'Advanced Topics',
      phaseLabel: 'Phase 4: Advanced Structures',
      order: 4,
      description: 'Graphs, Tries, and Range Query Trees.',
      topics: [
        {
          title: 'Graph Traversals (BFS & DFS)',
          key: 'graphs-bfs-dfs',
          order: 12,
          type: 'core',
          estimatedMinutes: 75,
          buildsOnNote: 'Generalization of trees where nodes may contain arbitrary cycles and multi-parent edges.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Represent graphs via adjacency lists vs adjacency matrices.',
            'Implement BFS for shortest paths in unweighted graphs and DFS for connected components.',
            'Perform topological sorting on Directed Acyclic Graphs (DAGs).'
          ],
          resources: [
            {
              type: 'Interactive Visualizer',
              title: 'VisuAlgo: Graph Traversal (DFS & BFS)',
              url: 'https://visualgo.net/en/dfsbfs',
              source: 'VisuAlgo',
              duration: '30 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'primary',
              reason: 'Animated edge classification (tree, back, forward, cross edges) and visited state tracking.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Guide',
              title: 'Topological Sort Algorithm Guide',
              url: 'https://www.geeksforgeeks.org/topological-sorting/',
              source: 'GeeksforGeeks',
              duration: '25 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'alternate',
              reason: 'Clear walkthrough of Kahn’s in-degree queue algorithm.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Number of Islands',
              description: 'Count connected 2D grid land components using BFS or DFS flood-fill.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/number-of-islands/'
            },
            {
              title: 'Course Schedule (Cycle Detection)',
              description: 'Detect cycles in prerequisite DAG using topological sort or DFS coloring.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/course-schedule/'
            },
            {
              title: 'Clone Graph',
              description: 'Return deep copy of connected undirected graph using hash map node mapping.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/clone-graph/'
            }
          ]
        },
        {
          title: 'Prefix Trees (Trie)',
          key: 'prefix-trees-trie',
          order: 13,
          type: 'optional',
          estimatedMinutes: 50,
          buildsOnNote: 'Tree structure specialized for efficient prefix retrieval in string datasets.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Store strings character-by-character to allow O(L) prefix lookup regardless of dataset size.',
            'Implement insert, search, and startsWith operations.',
            'Evaluate memory trade-offs of 26-element array nodes vs hash map child nodes.'
          ],
          resources: [
            {
              type: 'Guide',
              title: 'BaseCS: Trying to Understand Tries',
              url: 'https://medium.com/basecs/trying-to-understand-tries-3ec6bede0014',
              source: 'BaseCS',
              duration: '20 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'primary',
              reason: 'Charming illustrated introduction to dictionary compression and prefix retrieval.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Implement Trie (Prefix Tree)',
              description: 'Implement insert, search, and startsWith operations from scratch.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/implement-trie-prefix-tree/'
            },
            {
              title: 'Design Add and Search Words Data Structure',
              description: 'Support wildcard character matching across trie nodes using DFS branching.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/'
            },
            {
              title: 'Word Search II',
              description: 'Find all dictionary words on a Boggle board combining Trie with 2D backtracking.',
              type: 'Coding Exercise',
              difficulty: 'Hard',
              url: 'https://leetcode.com/problems/word-search-ii/'
            }
          ]
        },
        {
          title: 'Segment Trees & Range Queries',
          key: 'segment-trees',
          order: 14,
          type: 'stretch',
          estimatedMinutes: 80,
          buildsOnNote: 'Advanced structure for performing range aggregate queries and point updates in O(log n).',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Build a segment tree array in O(n) time.',
            'Query range minimum/sum in O(log n) time without recomputing intervals.',
            'Understand lazy propagation for range updates.'
          ],
          resources: [
            {
              type: 'Reference & Guide',
              title: 'CP-Algorithms: Segment Tree In-Depth',
              url: 'https://cp-algorithms.com/data_structures/segment_tree.html',
              source: 'CP-Algorithms',
              duration: '40 mins',
              language: 'English',
              level: 'Advanced',
              role: 'primary',
              reason: 'Industry-standard reference for array representation and lazy propagation.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Range Sum Query - Mutable',
              description: 'Implement dynamic point updates and range sum queries in logarithmic time.',
              type: 'Coding Exercise',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/range-sum-query-mutable/'
            },
            {
              title: 'Count of Smaller Numbers After Self',
              description: 'Calculate inversions using segment tree or binary indexed tree.',
              type: 'Coding Exercise',
              difficulty: 'Hard',
              url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/'
            },
            {
              title: 'My Calendar III',
              description: 'Track maximum concurrent events with dynamic interval segment tree.',
              type: 'Coding Exercise',
              difficulty: 'Hard',
              url: 'https://leetcode.com/problems/my-calendar-iii/'
            }
          ]
        }
      ]
    }
  ]
};

const dbmsRoadmap = {
  title: 'Database Management Systems (DBMS)',
  slug: 'dbms',
  outcome: 'Understand relational modeling, SQL proficiency, normalization theory, and internal database storage, indexing, and transaction guarantees.',
  level: 'Intermediate',
  prerequisites: ['Basic programming knowledge', 'Comfort with elementary discrete math and set theory basics'],
  estimatedHours: 36,
  weeklyPaceHours: 6,
  orderedPhaseTitles: ['Phase 1: Relational Foundations & Modeling', 'Phase 2: Relational Model & Advanced SQL', 'Phase 3: Database Design & Normalization', 'Phase 4: Database Internals & Transactions'],
  status: 'published',
  curator: 'Dr. Elena Rostova (Database Systems Architect)',
  lastReviewedDate: '2025-01-15',
  intendedAudience: 'Backend engineers, data engineers, and computer science students aiming to design robust, ACID-compliant data layers.',
  whatIsOutOfScope: ['NoSQL distributed consensus protocols (Raft/Paxos)', 'Cloud vendor-specific billing/setup guides', 'ETL pipeline pipelines'],
  resourceMix: ['Interactive SQL environments', 'University Lecture Notes', 'Official Engine Documentation'],
  languages: ['English'],
  sampleTopicKey: 'relational-model-and-sql',
  modules: [
    {
      title: 'Fundamentals & Conceptual Modeling',
      phaseLabel: 'Phase 1: Relational Foundations & Modeling',
      order: 1,
      description: 'Foundational database concepts, architectures, and Entity-Relationship (ER) modeling.',
      topics: [
        {
          title: 'Database System Architecture & Data Models',
          key: 'dbms-architecture-data-models',
          order: 1,
          type: 'core',
          estimatedMinutes: 45,
          buildsOnNote: 'Sets the conceptual foundation for all subsequent relational and physical engine topics.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Understand the ANSI-SPARC 3-schema architecture (Internal, Conceptual, External).',
            'Contrast file systems with Database Management Systems regarding data redundancy and consistency.',
            'Differentiate between hierarchical, network, relational, and document models.'
          ],
          resources: [
            {
              type: 'Course Reading',
              title: 'CMU 15-445: Relational Data Model & Architecture Overview',
              url: 'https://15445.courses.cs.cmu.edu/fall2022/notes/01-introduction.pdf',
              source: 'Carnegie Mellon University Database Group',
              duration: '30 mins',
              language: 'English',
              level: 'Beginner',
              role: 'primary',
              reason: 'World-class academic introduction to data independence and abstraction layers.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Article',
              title: 'GeeksforGeeks: DBMS 3-Tier Architecture',
              url: 'https://www.geeksforgeeks.org/dbms/introduction-of-3-tier-architecture-in-dbms-set-2/',
              source: 'GeeksforGeeks',
              duration: '20 mins',
              language: 'English',
              level: 'Beginner',
              role: 'alternate',
              reason: 'Concise visual overview of physical vs logical data independence.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Conceptual Schema Mapping Drill',
              description: 'Identify external views vs conceptual schema boundaries in real-world scenarios.',
              type: 'Conceptual Challenge',
              difficulty: 'Easy',
              url: 'https://gateoverflow.in/subject/databases?tab=questions'
            },
            {
              title: 'Data Independence Identification',
              description: 'Classify schema modifications as preserving logical or physical data independence.',
              type: 'Conceptual Challenge',
              difficulty: 'Easy',
              url: 'https://www.sanfoundry.com/dbms-questions-answers-data-independence/'
            },
            {
              title: 'File System vs DBMS Trade-offs',
              description: 'Analyze failure recovery and concurrency limitations of operating system flat files.',
              type: 'Conceptual Challenge',
              difficulty: 'Easy',
              url: 'https://gateoverflow.in/questions/databases'
            }
          ]
        },
        {
          title: 'Entity-Relationship (ER) Modeling',
          key: 'er-modeling',
          order: 2,
          type: 'core',
          estimatedMinutes: 60,
          buildsOnNote: 'Translates human business requirements into formal conceptual diagrams.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Identify entity sets, attributes (key, composite, multi-valued), and relationships.',
            'Model cardinality ratios (1:1, 1:N, M:N) and participation constraints (total vs partial).',
            'Convert ER diagrams into relational tables with appropriate foreign keys.'
          ],
          resources: [
            {
              type: 'Guide',
              title: 'ER Modeling and Relational Mapping Tutorial',
              url: 'https://www.guru99.com/er-diagram-tutorial-dbms.html',
              source: 'Guru99 Database Engineering',
              duration: '35 mins',
              language: 'English',
              level: 'Beginner',
              role: 'primary',
              reason: 'Clear pictorial guide showing step-by-step reduction of ER diagrams to relational tables.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Documentation',
              title: 'PostgreSQL: Schema Design & Keys Documentation',
              url: 'https://www.postgresql.org/docs/current/ddl-constraints.html',
              source: 'PostgreSQL Official Docs',
              duration: '25 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'alternate',
              reason: 'Practical constraint definitions enforcing relational modeling rules in SQL.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'ER-to-Relational Table Reduction',
              description: 'Convert an M:N relationship with descriptive attributes into relational schema with junction table.',
              type: 'Conceptual Challenge',
              difficulty: 'Medium',
              url: 'https://gateoverflow.in/subject/databases?tab=questions'
            },
            {
              title: 'Weak Entity Identification',
              description: 'Determine primary key composition for weak entities with identifying relationships.',
              type: 'Conceptual Challenge',
              difficulty: 'Easy',
              url: 'https://gateoverflow.in/422887/gate-cse-2024-set-2-question-10'
            },
            {
              title: 'Cardinality Constraint Verification',
              description: 'Verify maximum and minimum table counts for 1:N relationship mappings.',
              type: 'Conceptual Challenge',
              difficulty: 'Medium',
              url: 'https://gateoverflow.in/218954/what-an-interesting-dbms-question'
            }
          ]
        }
      ]
    },
    {
      title: 'Relational Model & SQL Mastery',
      phaseLabel: 'Phase 2: Relational Model & Advanced SQL',
      order: 2,
      description: 'Relational algebra, core SQL DDL/DML, joins, subqueries, grouping, and window functions.',
      topics: [
        {
          title: 'Relational Algebra & Core SQL Queries',
          key: 'relational-model-and-sql',
          order: 3,
          type: 'core',
          estimatedMinutes: 65,
          buildsOnNote: 'Formal mathematical foundation (select, project, join) behind declarative SQL.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Express queries using relational algebra operators (σ, π, ⨝, ρ, ∪, −).',
            'Write expressive SQL queries utilizing SELECT, WHERE, GROUP BY, HAVING, and ORDER BY.',
            'Master INNER, LEFT, RIGHT, and FULL OUTER joins and recognize NULL propagation.'
          ],
          resources: [
            {
              type: 'Interactive Guide',
              title: 'SQLBolt: Interactive Lessons and Exercises',
              url: 'https://sqlbolt.com/',
              source: 'SQLBolt',
              duration: '35 mins',
              language: 'English',
              level: 'Beginner',
              role: 'primary',
              reason: 'Instant in-browser query execution for queries, joins, and aggregates.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Documentation',
              title: 'PostgreSQL: Queries & Table Expressions',
              url: 'https://www.postgresql.org/docs/current/queries.html',
              source: 'PostgreSQL Official Docs',
              duration: '30 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'alternate',
              reason: 'Authoritative guide to SQL clause evaluation order and set operations.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Combine Two Tables',
              description: 'Write a LEFT JOIN to report address details regardless of person existence.',
              type: 'SQL Query',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/combine-two-tables/'
            },
            {
              title: 'Employees Earning More Than Their Managers',
              description: 'Perform a self-join to compare employee salary against manager record.',
              type: 'SQL Query',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/'
            },
            {
              title: 'Duplicate Emails',
              description: 'Identify repeating email entries using GROUP BY and HAVING count > 1.',
              type: 'SQL Query',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/duplicate-emails/'
            },
            {
              title: 'Department Highest Salary',
              description: 'Find employees who have the highest salary in each department using correlated subquery or join.',
              type: 'SQL Query',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/department-highest-salary/'
            }
          ]
        },
        {
          title: 'Advanced SQL: Window Functions & CTEs',
          key: 'advanced-sql-window-functions',
          order: 4,
          type: 'core',
          estimatedMinutes: 60,
          buildsOnNote: 'Extends aggregate querying to calculations across related row partitions without collapsing rows.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Use Common Table Expressions (WITH clauses) and recursive CTEs for hierarchical queries.',
            'Apply ranking functions (ROW_NUMBER, RANK, DENSE_RANK) with OVER (PARTITION BY ... ORDER BY ...).',
            'Compute running totals and moving averages using window framing clauses.'
          ],
          resources: [
            {
              type: 'Interactive Tutorial',
              title: 'PostgreSQL Window Functions Tutorial',
              url: 'https://www.postgresqltutorial.com/postgresql-window-function/',
              source: 'PostgreSQL Tutorial',
              duration: '30 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'primary',
              reason: 'Concise visual comparisons between aggregate GROUP BY and window OVER clauses.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Guide',
              title: 'Modern SQL: CTEs and Window Functions',
              url: 'https://modern-sql.com/feature/with',
              source: 'Modern SQL',
              duration: '25 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'alternate',
              reason: 'Industry best practices for readable, maintainable complex SQL pipelines.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Rank Scores',
              description: 'Rank database score entries using DENSE_RANK window function.',
              type: 'SQL Query',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/rank-scores/'
            },
            {
              title: 'Consecutive Numbers',
              description: 'Find all numbers that appear at least three times consecutively using LEAD/LAG.',
              type: 'SQL Query',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/consecutive-numbers/'
            },
            {
              title: 'Department Top Three Salaries',
              description: 'Find top three unique earners per department using DENSE_RANK over partitions.',
              type: 'SQL Query',
              difficulty: 'Hard',
              url: 'https://leetcode.com/problems/department-top-three-salaries/'
            }
          ]
        }
      ]
    },
    {
      title: 'Database Design & Normalization',
      phaseLabel: 'Phase 3: Database Design & Normalization',
      order: 3,
      description: 'Functional dependencies, normal forms (1NF, 2NF, 3NF, BCNF), and lossless decomposition.',
      topics: [
        {
          title: 'Functional Dependencies & Closure',
          key: 'functional-dependencies',
          order: 5,
          type: 'core',
          estimatedMinutes: 55,
          buildsOnNote: 'Mathematical tool to formalize constraints and prevent data anomalies.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Define functional dependencies (X → Y) and attribute closure (X+).',
            'Apply Armstrong’s Axioms (reflexivity, augmentation, transitivity).',
            'Determine candidate keys and super keys programmatically from dependency sets.'
          ],
          resources: [
            {
              type: 'Course Notes',
              title: 'Stanford CS145: Functional Dependencies & Keys',
              url: 'https://web.stanford.edu/class/cs145/',
              source: 'Stanford Database Systems',
              duration: '30 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'primary',
              reason: 'Clear algorithm for computing attribute closure and identifying minimal candidate keys.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Guide',
              title: 'GeeksforGeeks: Finding Attribute Closure and Keys',
              url: 'https://www.geeksforgeeks.org/dbms/finding-attribute-closure-and-candidate-keys-using-functional-dependencies/',
              source: 'GeeksforGeeks',
              duration: '20 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'alternate',
              reason: 'Worked examples calculating attribute closures step-by-step.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Candidate Key Determination',
              description: 'Given schema R(A,B,C,D,E) and functional dependencies, identify all candidate keys.',
              type: 'Conceptual Challenge',
              difficulty: 'Medium',
              url: 'https://gateoverflow.in/tag/candidate-key'
            },
            {
              title: 'Minimal Cover Calculation',
              description: 'Simplify redundant functional dependencies into a canonical minimal cover.',
              type: 'Conceptual Challenge',
              difficulty: 'Medium',
              url: 'https://gateoverflow.in/tag/minimal-cover'
            },
            {
              title: 'Dependency Preservation Check',
              description: 'Verify if a decomposed set of tables preserves all original functional dependencies.',
              type: 'Conceptual Challenge',
              difficulty: 'Hard',
              url: 'https://gateoverflow.in/869/gate-cse-2002-question-16'
            }
          ]
        },
        {
          title: 'Normalization (1NF, 2NF, 3NF, BCNF)',
          key: 'normalization-theory',
          order: 6,
          type: 'core',
          estimatedMinutes: 65,
          buildsOnNote: 'Direct application of functional dependencies to eliminate insertion, deletion, and update anomalies.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Detect and remediate update, insertion, and deletion anomalies.',
            'Differentiate between 1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency), and BCNF (every determinant is super key).',
            'Guarantee lossless-join decomposition when normalizing schemas.'
          ],
          resources: [
            {
              type: 'Tutorial',
              title: 'Database Normalization: From 1NF to BCNF with Real Examples',
              url: 'https://www.guru99.com/database-normalization.html',
              source: 'Guru99 Database Guides',
              duration: '35 mins',
              language: 'English',
              level: 'Beginner',
              role: 'primary',
              reason: 'Concrete before-and-after tables demonstrating anomaly removal.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Course Video & Notes',
              title: 'CMU 15-445: Database Design Theory & Normal Forms',
              url: 'https://15445.courses.cs.cmu.edu/fall2022/',
              source: 'Carnegie Mellon University',
              duration: '40 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'alternate',
              reason: 'Rigorous engineering trade-offs between normal form purity and join latency.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Identify Normal Form Level',
              description: 'Determine the highest normal form satisfied by given relation and dependency set.',
              type: 'Conceptual Challenge',
              difficulty: 'Medium',
              url: 'https://gateoverflow.in/tag/normal-forms'
            },
            {
              title: 'Lossless Join Decomposition Test',
              description: 'Apply intersection rule to prove whether binary decomposition is guaranteed lossless.',
              type: 'Conceptual Challenge',
              difficulty: 'Medium',
              url: 'https://www.geeksforgeeks.org/dbms/lossless-decomposition-in-dbms/'
            },
            {
              title: 'BCNF Decomposition Algorithm',
              description: 'Decompose non-BCNF relation into BCNF schemas iteratively.',
              type: 'Conceptual Challenge',
              difficulty: 'Hard',
              url: 'https://www.geeksforgeeks.org/dbms/boyce-codd-normal-form-bcnf/'
            }
          ]
        }
      ]
    },
    {
      title: 'Database Internals, Indexing & Transactions',
      phaseLabel: 'Phase 4: Database Internals & Transactions',
      order: 4,
      description: 'Under the hood: B+ Tree indexing, ACID transactions, concurrency schedules, and crash recovery.',
      topics: [
        {
          title: 'Storage & B+ Tree Indexing',
          key: 'indexing-and-b-trees',
          order: 7,
          type: 'core',
          estimatedMinutes: 70,
          buildsOnNote: 'Bridges logical SQL queries to physical disk block access patterns.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Analyze page layout, slotted pages, and buffer pool caching mechanics.',
            'Understand B+ Tree invariants: fanout, balanced height, and linked leaf nodes for range scans.',
            'Contrast clustered indexes (primary key index) with secondary non-clustered indexes.'
          ],
          resources: [
            {
              type: 'Interactive Visualizer',
              title: 'USFCA: B+ Tree Interactive Visualization',
              url: 'https://www.cs.usfca.edu/~galles/visualization/BPlusTree.html',
              source: 'University of San Francisco Visualizations',
              duration: '25 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'primary',
              reason: 'Interactive page splitting and node merging visualizer under heavy insert/delete loads.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Book / Reference',
              title: 'Use The Index, Luke: A Guide to Database Performance for Developers',
              url: 'https://use-the-index-luke.com/',
              source: 'Use The Index, Luke by Markus Winand',
              duration: '45 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'alternate',
              reason: 'The definitive pragmatic handbook on index selection, multi-column ordering, and index-only scans.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'B+ Tree Maximum Key Capacity Calculation',
              description: 'Calculate maximum number of record pointers given page size, key size, and tree height.',
              type: 'Conceptual Challenge',
              difficulty: 'Medium',
              url: 'https://www.geeksforgeeks.org/dbms/practice-questions-b-b-trees/'
            },
            {
              title: 'Index Selection for Compound Queries',
              description: 'Design the optimal composite index (A, B, C) for queries containing equality and range predicates.',
              type: 'Conceptual Challenge',
              difficulty: 'Medium',
              url: 'https://use-the-index-luke.com/sql/where-clause/searching-for-ranges/greater-less-between-tuning-sql-access-filter'
            },
            {
              title: 'Index Seek vs Table Scan Cost Evaluation',
              description: 'Determine selectivity threshold where optimizer switches from index seek to sequential table scan.',
              type: 'Conceptual Challenge',
              difficulty: 'Hard',
              url: 'https://www.postgresql.org/docs/current/using-explain.html'
            }
          ]
        },
        {
          title: 'ACID Transactions & Concurrency Control',
          key: 'transactions-concurrency-control',
          order: 8,
          type: 'core',
          estimatedMinutes: 75,
          buildsOnNote: 'Guarantees reliability and correctness in multi-user concurrent database environments.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Define ACID properties (Atomicity, Consistency, Isolation, Durability).',
            'Identify concurrency anomalies: Dirty Read, Non-repeatable Read, Phantom Read.',
            'Evaluate conflict serializability using precedence graphs (serialization graphs).',
            'Understand Two-Phase Locking (2PL) and strict 2PL to prevent cascading aborts.'
          ],
          resources: [
            {
              type: 'Course Notes',
              title: 'CMU 15-445: Concurrency Control & Two-Phase Locking',
              url: 'https://15445.courses.cs.cmu.edu/fall2022/slides/16-twophaselocking.pdf',
              source: 'CMU Database Group',
              duration: '35 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'primary',
              reason: 'Industry gold-standard treatment of conflict equivalence, view equivalence, and lock managers.',
              lastCheckedDate: '2025-01-15'
            },
            {
              type: 'Documentation',
              title: 'PostgreSQL: Transaction Isolation Levels',
              url: 'https://www.postgresql.org/docs/current/transaction-iso.html',
              source: 'PostgreSQL Official Docs',
              duration: '30 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'alternate',
              reason: 'Explains how Read Committed, Repeatable Read, and Serializable behave in real database systems.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'Conflict Serializability Precedence Graph',
              description: 'Construct serialization precedence graph for interleaved read/write operations to detect cycles.',
              type: 'Conceptual Challenge',
              difficulty: 'Medium',
              url: 'https://gateoverflow.in/tag/conflict-serializable'
            },
            {
              title: 'Deadlock Detection in Two-Phase Locking',
              description: 'Identify wait-for graph deadlocks and evaluate Wait-Die vs Wound-Wait prevention schemes.',
              type: 'Conceptual Challenge',
              difficulty: 'Medium',
              url: 'https://gateoverflow.in/118325/gate-cse-2017-set-1-question-42'
            },
            {
              title: 'Isolation Level Anomaly Mapping',
              description: 'Determine which anomalies are permitted under Read Uncommitted, Read Committed, and Repeatable Read.',
              type: 'Conceptual Challenge',
              difficulty: 'Easy',
              url: 'https://www.postgresql.org/docs/current/transaction-iso.html'
            }
          ]
        },
        {
          title: 'Crash Recovery & Write-Ahead Logging (ARIES)',
          key: 'crash-recovery-aries',
          order: 9,
          type: 'optional',
          estimatedMinutes: 60,
          buildsOnNote: 'Ensures Durability and Atomicity in the event of power cuts or OS crashes.',
          lastVerifiedDate: '2025-01-15',
          objectives: [
            'Understand Write-Ahead Logging (WAL) protocol: log records reach disk before dirty pages.',
            'Trace the three phases of ARIES recovery: Analysis, Redo, and Undo.',
            'Understand checkpointing and Compensation Log Records (CLRs) to guarantee idempotency during repeated crashes.'
          ],
          resources: [
            {
              type: 'Course Notes',
              title: 'CMU 15-445: Database Crash Recovery & ARIES',
              url: 'https://15445.courses.cs.cmu.edu/fall2022/notes/20-recovery.pdf',
              source: 'Carnegie Mellon University',
              duration: '35 mins',
              language: 'English',
              level: 'Intermediate',
              role: 'primary',
              reason: 'Comprehensive diagram of log sequence numbers (LSN), flushLSN, and dirty page tables.',
              lastCheckedDate: '2025-01-15'
            }
          ],
          practiceItems: [
            {
              title: 'ARIES Redo/Undo Phase Execution Trace',
              description: 'Given a crash state log with checkpoints, determine which transactions need Redo vs Undo.',
              type: 'Conceptual Challenge',
              difficulty: 'Hard',
              url: 'https://cs186berkeley.net/notes/note14/'
            },
            {
              title: 'WAL Protocol Constraint Verification',
              description: 'Explain why dirty data pages cannot be flushed before the corresponding transaction log commit record.',
              type: 'Conceptual Challenge',
              difficulty: 'Medium',
              url: 'https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/database-file-operations/logging-data-storage-algorithms'
            },
            {
              title: 'Checkpoint Recovery Speed Analysis',
              description: 'Calculate recovery speedup achieved by fuzzy checkpointing compared to non-checkpointed logs.',
              type: 'Conceptual Challenge',
              difficulty: 'Medium',
              url: 'https://15445.courses.cs.cmu.edu/spring2026/notes/23-recovery.pdf'
            }
          ]
        }
      ]
    }
  ]
};

module.exports = { dsaRoadmap, dbmsRoadmap };
