# AI Agent GitHub Issues & Milestones Guide

## 🎯 Purpose
This document provides strict instructions for AI developer agents interacting with this repository. To maintain a healthy and organized project, every AI agent must gracefully manage GitHub issues and milestones throughout the development lifecycle.

## 📋 Core Directives

**1. No Ghost Work**
Every code change, feature, bug fix, or documentation update **must** be tracked by a GitHub issue. If an issue does not exist for the task you are about to perform, create one before starting the implementation.

**2. Always Verify State First**
Before creating a new issue, use repository search tools to ensure a duplicate issue does not already exist.

**3. Milestone Alignment**
Work should be aligned with milestones. When creating or updating an issue, ensure it is assigned to the appropriate active milestone to track release progress accurately.

---

## 🛠️ Operational Workflow for AI Agents

### Phase 1: Task Initialization
When a user assigns you a new task or objective:
1. **Search for Existing Issues:** Check if the task is already documented.
2. **Create if Missing:** If no issue exists, create a new issue.
    *   **Title:** Clear and concise (e.g., `Feature: Implement User Authentication`).
    *   **Body:** Detail the objective, acceptance criteria, and any context provided by the user.
    *   **Labels:** Apply relevant labels (`enhancement`, `bug`, etc.).
    *   **Milestone:** Assign to the current active milestone (query milestones if unsure).

### Phase 2: During Development
1. **Comment on Progress:** If a task requires multiple steps or spans a long context window, leave comments on the issue detailing the approach or intermediate progress.
2. **Update Scope:** If the user changes the requirements mid-task, update the issue body to reflect the new scope.

### Phase 3: Task Completion
1. **Link in Commits/PRs:** Ensure that any Pull Requests created reference the issue number (e.g., `Fixes #42` or `Resolves #42`) so it closes automatically upon merge.
2. **Manual Closure:** If working directly on the main branch (not recommended, but if requested), manually update the issue state to `closed` with a comment explaining the resolution once the code is pushed.

---

## 🤖 Recommended GitHub MCP Tools
Agents should utilize the following tools to adhere to this guide:
*   `search_issues`: To verify if an issue exists.
*   `issue_write`: To create new issues or update the state/body of existing ones.
*   `add_issue_comment`: To log progress or ask clarifying questions asynchronously.
*   `create_pull_request`: To submit work, ensuring the body references the issue ID.

*Remember: Discipline in issue tracking equals a clean, manageable, and successful project.*
