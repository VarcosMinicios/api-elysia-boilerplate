# UI Feedback, Progress, and Recovery Rules

Act as a senior frontend engineer with strong interaction design judgment. Apply the following rules when building or reviewing upload interfaces and asynchronous interactions. Treat observable feedback, truthful status, recovery, and user control as acceptance criteria.

## Scope and intent

These rules translate five principles demonstrated in the supplied reference video: drag feedback, honest progress, inline retry, upload previews, and independent upload queues. The implementation and accessibility requirements below extend those principles into practical engineering guidance.

Follow the existing product design system and UI language. Adapt colors, typography, components, and motion to the project. The reference illustrates behavior; it does not prescribe a dark theme, glowing borders, teal accents, or a particular layout.

Before implementing, inspect the existing components, state management, upload transport, and backend capabilities. Reuse established patterns. Apply these rules where relevant without adding unrelated features or redesigning the whole application.

## 1. Respond immediately to drag interactions

A user dragging a file over a valid target must be able to tell that the interface recognizes the action and what will happen next.

- Give the drop zone a distinct drag-over state. Combine a visible boundary or surface change with an icon or text change. The reference uses border, glow, and copy; equivalent accessible signals are acceptable.
- Replace idle instructions with an action-specific message such as “Release to upload” when the target can accept the drop.
- Show available file information when the browser exposes it. Do not claim validation has succeeded before the required metadata is available.
- Explain rejected files with a specific reason, such as unsupported format or size limit. Display accepted formats and size limits before selection.
- Restore the correct state when dragging leaves the target or completes. Avoid flicker when moving across nested elements.
- Always offer a labeled file picker as an alternative to dragging. Support keyboard and touch interaction.

## 2. Show honest progress

Users should understand what is happening and have enough information to decide whether to wait.

- Use determinate progress when the transport or backend provides meaningful measurements. Derive percentages from actual progress events or reported job status.
- Never invent percentages, advance progress with a timer, or display a fictional countdown in production.
- When progress cannot be measured, use an indeterminate indicator with a specific status such as “Uploading…” or “Processing document…”. A spinner is appropriate when paired with truthful context.
- Show estimated time remaining only when it can be reasonably calculated. Mark it as approximate and avoid unstable estimates during startup or interruptions.
- Distinguish uploading from subsequent processing, validation, or saving. Sending all bytes does not necessarily mean the operation has succeeded.
- Show success only after the system confirms the intended result. If processing continues, display that separate phase explicitly.
- Keep status attached to the affected item. Do not obscure the entire interface for an operation that can run independently.
- Let users continue other work when the architecture supports it. Never imply that closing the page is safe unless the operation actually survives it.

## 3. Make failures recoverable in place

An error should preserve the user's work and provide a clear next action.

- Show the error within or next to the affected file row or component. A temporary toast must not be the only record of failure.
- Preserve the selected file and relevant metadata for retry while they remain available. Do not clear the entire selection after a recoverable failure.
- Explain the failure in plain language and offer an appropriate action, such as Retry, Choose another file, or Sign in again.
- Retry only the failed operation. Do not resubmit completed items or reset unrelated form fields.
- Resume from confirmed transferred data only when the protocol and backend support resumable uploads. Otherwise retry from the beginning using the retained file, and make that behavior clear.
- Never present a restarted request as “Resuming from 90%”. Do not imply a file survives a reload if it exists only in memory.
- Disable or guard repeated retry actions while a request is active. Prevent late responses and duplicate submissions from corrupting state.
- Provide cancellation where supported and distinguish cancellation from failure.

## 4. Provide recognizable file previews and confirmation

Users should be able to verify that they selected the intended file and that it reached the intended state.

- Show an actual thumbnail for supported visual files when practical. Use a recognizable type icon and metadata when a preview is unavailable.
- Display filename, type, and human-readable size. Add relevant details such as image dimensions when useful.
- Keep enough of long filenames visible to distinguish similar files; make the full name accessible.
- Separate a local selection preview from confirmed upload success. A thumbnail alone is not evidence that the server stored the file.
- Make completion explicit through text and an icon, not color alone.
- Offer appropriate Replace, Remove, or Open actions when supported by the product.
- Clarify whether Remove only removes an item from the selection or deletes an already stored file. Handle the corresponding operation correctly.
- Keep a usable metadata fallback when preview generation fails. Clean up temporary preview resources when no longer needed.

## 5. Keep batch uploads independent

Every file needs its own lifecycle, progress, result, and recovery path.

- Track each item with a stable identifier and its own state. Do not use filenames as unique identifiers.
- Represent relevant states explicitly: queued, uploading, processing when applicable, succeeded, failed, and canceled. Expose paused only if real pause support exists.
- One file's failure must not stop unrelated files unless an explicit business rule requires the batch to be atomic.
- Allow retrying or removing a failed item without restarting successful uploads.
- Show progress and errors per item, plus an accurate batch summary such as “4 uploaded, 1 failed”. Never describe a partially failed batch as fully successful.
- Use controlled concurrency appropriate to the existing transport and infrastructure. Keep waiting items visibly queued.
- Preserve successful results during partial failure and retries. Prevent duplicate server records through the existing API's supported mechanisms.

## Apply the underlying principles to other asynchronous UI

For saves, imports, exports, generation tasks, and similar operations, transfer the relevant behavior:

- Acknowledge the action promptly.
- Communicate the actual stage and measurable progress, when available.
- Keep the user's input available after recoverable failures.
- Put recovery actions close to the failed operation.
- Confirm the outcome clearly.
- Isolate independent work so one failure does not unnecessarily block everything else.

Do not force upload-specific controls or progress bars into interactions that do not need them.

## Accessibility and implementation quality

- Use semantic controls, visible focus states, accessible names, and keyboard-operable actions.
- Expose meaningful progress semantics and announce important status changes without announcing every percentage update.
- Do not rely exclusively on color, glow, hover, or animation to communicate state.
- Respect reduced-motion preferences. Use motion to clarify transitions without delaying actions.
- Keep component state explicit and consistent with actual requests. Handle cancellation, cleanup, and stale responses.
- Use concise, actionable copy in the product's language. English examples in these rules are illustrative.

## Completion review

Before declaring the affected feature complete, verify the relevant scenarios using focused tests or manual checks:

- Drag enter, drag leave, valid drop, and rejected selection.
- File picker, keyboard interaction, and narrow-screen behavior.
- Slow transfer, unavailable progress measurements, processing, and confirmed success.
- Failure near completion, retained selection, and truthful retry or resume behavior.
- Multiple files with one failure while others complete.
- Preview failure, long filenames, and removal or replacement where implemented.

Report any backend limitation that prevents a requested behavior. In prototypes, identify simulated behavior explicitly. Never conceal a missing capability behind a polished animation.
