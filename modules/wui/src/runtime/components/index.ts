// ============================================
// ATOMIC DESIGN SYSTEM - WUI COMPONENTS
// ============================================
//
// Atoms: Basic building blocks (buttons, inputs, labels)
// Molecules: Groups of atoms working together (form fields, cards)
// Organisms: Complex components composed of molecules (forms, tables, navigation)
//
// ============================================

// ============================================
// TEMPLATES - Page-level components
// ============================================

// API Documentation Templates
export { default as WApiDocsLayout } from './templates/api-docs/ApiDocsLayout.vue'
export { default as WApiEndpoint } from './templates/api-docs/ApiEndpoint.vue'
export { default as WApiParameters } from './templates/api-docs/ApiParameters.vue'
export { default as WApiResponses } from './templates/api-docs/ApiResponses.vue'
export { default as WApiTester } from './templates/api-docs/ApiTester.vue'
export { default as WApiTesterCurlCommand } from './templates/api-docs/ApiTesterCurlCommand.vue'
export { default as WApiTesterForm } from './templates/api-docs/ApiTesterForm.vue'
export { default as WApiTesterResponse } from './templates/api-docs/ApiTesterResponse.vue'

// Layout Templates
export { default as WAppHeader } from './templates/layout/AppHeader.vue'
export { default as WAppHeaderNav } from './templates/layout/AppHeaderNav.vue'
export { default as WAppHeaderSearch } from './templates/layout/AppHeaderSearch.vue'
export { default as WPageFooter } from './templates/layout/PageFooter.vue'
export { default as WPageBottom } from './templates/layout/PageBottom.vue'
export { default as WPageHeader } from './templates/layout/PageHeader.vue'
export { default as WSideBar } from './templates/layout/SideBar.vue'

// ============================================
// ATOMS - Basic building blocks
// ============================================

// UI Elements
export { default as WAvatar } from './atoms/Avatar.vue'
export { default as WBadge } from './atoms/Badge.vue'
export { default as WButton } from './atoms/Button.vue'
export { default as WCheckbox } from './atoms/Checkbox.vue'
export { default as WChip } from './atoms/Chip.vue'
export { default as WCode } from './atoms/Code.vue'
export { default as WContainer } from './atoms/Container.vue'
export { default as WDivider } from './atoms/Divider.vue'
export { default as WDropzone } from './atoms/Dropzone.vue'
export { default as WFlex } from './atoms/Flex.vue'
export { default as WGrid } from './atoms/Grid.vue'
export { default as WHeading } from './atoms/Heading.vue'
export { default as WIcon } from './atoms/Icon.vue'
export { default as WImage } from './atoms/Image.vue'
export { default as WInput } from './atoms/Input.vue'
export { default as WKbd } from './atoms/Kbd.vue'
export { default as WLabel } from './atoms/Label.vue'
export { default as WLink } from './atoms/Link.vue'
export { default as WPopover } from './atoms/Popover.vue'
export { default as WProgress } from './atoms/Progress.vue'
export { default as WRadio } from './atoms/Radio.vue'
export { default as WSelect } from './atoms/Select.vue'
export { default as WSeparator } from './atoms/Separator.vue'
export { default as WSlider } from './atoms/Slider.vue'
export { default as WSpinner } from './atoms/Spinner.vue'
export { default as WStack } from './atoms/Stack.vue'
export { default as WSwitch } from './atoms/Switch.vue'
export { default as WText } from './atoms/Text.vue'
export { default as WTextarea } from './atoms/Textarea.vue'
export { default as WToast } from './atoms/Toast.vue'
export { default as WToggle } from './atoms/Toggle.vue'
export { default as WTooltip } from './atoms/Tooltip.vue'

// Layout Atoms
export { default as WAside } from './atoms/Aside.vue'
export { default as WMain } from './atoms/Main.vue'
export { default as WSection } from './atoms/Section.vue'
export { default as WSidebarLayout } from './atoms/SidebarLayout.vue'

// Table Atoms
export { default as WTableCell } from './atoms/TableCell.vue'

// Menu Atoms
export { default as WMenuSeparator } from './atoms/MenuSeparator.vue'

// Feedback Atoms
export { default as WEmpty } from './atoms/Empty.vue'
export { default as WFormError } from './atoms/FormError.vue'
export { default as WFormSuccess } from './atoms/FormSuccess.vue'
export { default as WSkeleton } from './atoms/Skeleton.vue'

// ============================================
// MOLECULES - Groups of atoms
// ============================================

// Accordion
export { default as WAccordion } from './molecules/Accordion.vue'
export { default as WAccordionItem } from './molecules/AccordionItem.vue'

// Alert & Status
export { default as WAlert } from './molecules/Alert.vue'
export { default as WAlertDescription } from './molecules/AlertDescription.vue'
export { default as WAlertTitle } from './molecules/AlertTitle.vue'
export { default as WError } from './molecules/Error.vue'
export { default as WInfo } from './molecules/Info.vue'
export { default as WSuccess } from './molecules/Success.vue'
export { default as WWarning } from './molecules/Warning.vue'

// Breadcrumb
export { default as WBreadcrumb } from './molecules/Breadcrumb.vue'
export { default as WBreadcrumbs } from './molecules/Breadcrumbs.vue'

// Card
export { default as WCard } from './molecules/Card.vue'
export { default as WCardContent } from './molecules/CardContent.vue'
export { default as WCardDescription } from './molecules/CardDescription.vue'
export { default as WCardFooter } from './molecules/CardFooter.vue'
export { default as WCardHeader } from './molecules/CardHeader.vue'
export { default as WCardTitle } from './molecules/CardTitle.vue'

// Collapsible
export { default as WCollapsible } from './molecules/Collapsible.vue'

// Color Picker
export { default as WColorPicker } from './molecules/ColorPicker.vue'
export { default as WColorPalette } from './molecules/ColorPalette.vue'

// Date & Time
export { default as WDatePicker } from './molecules/DatePicker.vue'
export { default as WTimePicker } from './molecules/TimePicker.vue'

// Dialog
export { default as WDialog } from './molecules/Dialog.vue'
export { default as WDialogContent } from './molecules/DialogContent.vue'
export { default as WDialogDescription } from './molecules/DialogDescription.vue'
export { default as WDialogFooter } from './molecules/DialogFooter.vue'
export { default as WDialogHeader } from './molecules/DialogHeader.vue'
export { default as WDialogTitle } from './molecules/DialogTitle.vue'
export { default as WConfirmDialog } from './molecules/ConfirmDialog.vue'

// File Upload
export { default as WFileUpload } from './molecules/FileUpload.vue'

// Form Molecules
export { default as WFormField } from './molecules/FormField.vue'
export { default as WFormGroup } from './molecules/FormGroup.vue'
export { default as WInputNumber } from './molecules/InputNumber.vue'
export { default as WInputPhone } from './molecules/InputPhone.vue'
export { default as WInputEmail } from './molecules/InputEmail.vue'
export { default as WInputPassword } from './molecules/InputPassword.vue'
export { default as WInputOtp } from './molecules/InputOtp.vue'
export { default as WInputSearch } from './molecules/InputSearch.vue'
export { default as WSearchInput } from './molecules/SearchInput.vue'

// Loading
export { default as WLoading } from './molecules/Loading.vue'

// Stats & Dashboard
export { default as WStatCard } from './molecules/StatCard.vue'
export { default as WDashboardWidget } from './molecules/DashboardWidget.vue'

// Menu
export { default as WMenu } from './molecules/Menu.vue'
export { default as WMenuItem } from './molecules/MenuItem.vue'
export { default as WContextMenu } from './molecules/ContextMenu.vue'

// Navigation
export { default as WPagination } from './molecules/Pagination.vue'

// Panel
export { default as WPanel } from './molecules/Panel.vue'

// Rating
export { default as WRating } from './molecules/Rating.vue'

// Stepper
export { default as WStepper } from './molecules/Stepper.vue'

// Tabs
export { default as WTabs } from './molecules/Tabs.vue'
export { default as WTabsContent } from './molecules/TabsContent.vue'
export { default as WTabsList } from './molecules/TabsList.vue'
export { default as WTabsTrigger } from './molecules/TabsTrigger.vue'

// Table Molecules
export { default as WDataTable } from './molecules/DataTable.vue'
export { default as WTableHeader } from './molecules/TableHeader.vue'
export { default as WTableRow } from './molecules/TableRow.vue'

// List Molecules
export { default as WListItem } from './molecules/ListItem.vue'

// Timeline Molecules
export { default as WTimelineItem } from './molecules/TimelineItem.vue'

// Tree Molecules
export { default as WTreeItem } from './molecules/TreeItem.vue'

// Toggle
export { default as WToggleGroup } from './molecules/ToggleGroup.vue'
export { default as WToggleGroupItem } from './molecules/ToggleGroupItem.vue'

// ============================================
// ORGANISMS - Complex components
// ============================================

// Carousel
export { default as WCarousel } from './organisms/Carousel.vue'

// Data Display Organisms
export { default as WList } from './organisms/List.vue'
export { default as WTable } from './organisms/Table.vue'
export { default as WTimeline } from './organisms/Timeline.vue'
export { default as WTree } from './organisms/Tree.vue'

// Feedback Organisms
export { default as WNotification } from './organisms/Notification.vue'

// Form Organism
export { default as WForm } from './organisms/Form.vue'

// Header
export { default as WHeader } from './organisms/Header.vue'

// Layout Organisms
export { default as WResizer } from './organisms/Resizer.vue'

// Lightbox
export { default as WLightbox } from './organisms/Lightbox.vue'

// Modal
export { default as WModal } from './organisms/Modal.vue'

// Navigation Organisms
export { default as WCalendar } from './organisms/Calendar.vue'
export { default as WCommandPalette } from './organisms/CommandPalette.vue'
export { default as WPaginationNav } from './organisms/Pagination.vue'
export { default as WRangeSlider } from './organisms/RangeSlider.vue'
export { default as WSidebar } from './organisms/Sidebar.vue'
export { default as WTabBar } from './organisms/TabBar.vue'
export { default as WTopNav } from './organisms/TopNav.vue'

// Navigation Organisms (New)
export { default as WNavHeader } from './organisms/navigation/Header.vue'
export { default as WNavItem } from './organisms/navigation/NavItem.vue'
export { default as WMobileMenuButton } from './organisms/navigation/MobileMenuButton.vue'
export { default as WTableOfContents } from './organisms/navigation/TableOfContents.vue'
export { default as WNavSearch } from './organisms/navigation/Search.vue'

// Content Organisms
export { default as WContentTree } from './organisms/content/ContentTree.vue'
export { default as WContentTreeItem } from './organisms/content/ContentTreeItem.vue'
export { default as WMarkdownRenderer } from './organisms/content/MarkdownRenderer.vue'
export { default as WPrevNext } from './organisms/content/PrevNext.vue'
export { default as WLogo } from './organisms/content/Logo.vue'
export { default as WSocialLinks } from './organisms/content/SocialLinks.vue'
export { default as WThemeToggle } from './organisms/content/ThemeToggle.vue'

// ============================================
// NEW ATOMS - General Purpose
// ============================================

// Display
export { default as WAspectRatio } from './atoms/AspectRatio.vue'
export { default as WBadgeGroup } from './atoms/BadgeGroup.vue'
export { default as WBlockquote } from './atoms/Blockquote.vue'
export { default as WClamp } from './atoms/Clamp.vue'
export { default as WCollapse } from './atoms/Collapse.vue'
export { default as WCopyButton } from './atoms/CopyButton.vue'
export { default as WExpand } from './atoms/Expand.vue'
export { default as WFigure } from './atoms/Figure.vue'
export { default as WHighlight } from './atoms/Highlight.vue'
export { default as WInlineCode } from './atoms/InlineCode.vue'
export { default as WPicture } from './atoms/Picture.vue'
export { default as WScrollToTop } from './atoms/ScrollToTop.vue'
export { default as WTag } from './atoms/Tag.vue'
export { default as WTime } from './atoms/Time.vue'
export { default as WTruncate } from './atoms/Truncate.vue'

// Navigation
export { default as WAnchor } from './atoms/Anchor.vue'
export { default as WSkipLink } from './atoms/SkipLink.vue'

// Accessibility
export { default as WFocusTrap } from './atoms/FocusTrap.vue'
export { default as WLiveRegion } from './atoms/LiveRegion.vue'
export { default as WVisuallyHidden } from './atoms/VisuallyHidden.vue'

// ============================================
// NEW MOLECULES - General Purpose
// ============================================

// Input
export { default as WCombobox } from './molecules/Combobox.vue'
export { default as WImageUpload } from './molecules/ImageUpload.vue'
export { default as WMultiSelect } from './molecules/MultiSelect.vue'
export { default as WPasswordStrength } from './molecules/PasswordStrength.vue'
export { default as WTagInput } from './molecules/TagInput.vue'

// Data Display
export { default as WAvatarGroup } from './molecules/AvatarGroup.vue'
export { default as WMetric } from './molecules/Metric.vue'
export { default as WSortable } from './molecules/Sortable.vue'
export { default as WStat } from './molecules/Stat.vue'

// Feedback
export { default as WEmptyState } from './molecules/EmptyState.vue'
export { default as WResult } from './molecules/Result.vue'

// Time
export { default as WCountdown } from './molecules/Countdown.vue'
export { default as WTimer } from './molecules/Timer.vue'

// Social
export { default as WActivityItem } from './molecules/ActivityItem.vue'
export { default as WComment } from './molecules/Comment.vue'
export { default as WNotificationItem } from './molecules/NotificationItem.vue'
export { default as WReply } from './molecules/Reply.vue'

// UI Controls
export { default as WFilterGroup } from './molecules/FilterGroup.vue'
export { default as WResizablePanel } from './molecules/ResizablePanel.vue'
export { default as WSplitButton } from './molecules/SplitButton.vue'

// ============================================
// NEW ORGANISMS - General Purpose
// ============================================

// Data
export { default as WDataGrid } from './organisms/DataGrid.vue'
export { default as WKanbanBoard } from './organisms/KanbanBoard.vue'

// Social
export { default as WChat } from './organisms/Chat.vue'
export { default as WComments } from './organisms/Comments.vue'
export { default as WFeed } from './organisms/Feed.vue'

// App
export { default as WCalendarRange } from './organisms/CalendarRange.vue'
export { default as WFileManager } from './organisms/FileManager.vue'
export { default as WImageGallery } from './organisms/ImageGallery.vue'
export { default as WInbox } from './organisms/Inbox.vue'
export { default as WWizard } from './organisms/Wizard.vue'

// ============================================
// MEDIA COMPONENTS - Advanced media handling
// ============================================

// Video & Audio
export { default as WVideoPlayer } from './organisms/media/VideoPlayer.vue'
export { default as WAudioPlayer } from './organisms/media/AudioPlayer.vue'
export { default as WPDFViewer } from './organisms/media/PDFViewer.vue'

// Editing
export { default as WCodeEditor } from './organisms/media/CodeEditor.vue'
export { default as WRichTextEditor } from './organisms/media/RichTextEditor.vue'

// Data encoding
export { default as WQRCode } from './organisms/media/QRCode.vue'
export { default as WBarcode } from './organisms/media/Barcode.vue'

// ============================================
// DATA VISUALIZATION COMPONENTS
// ============================================

// Charts
export { default as WChart } from './organisms/data-viz/Chart.vue'
export { default as WPieChart } from './organisms/data-viz/PieChart.vue'
export { default as WGauge } from './organisms/data-viz/Gauge.vue'
export { default as WKnob } from './organisms/data-viz/Knob.vue'
export { default as WGanttChart } from './organisms/data-viz/GanttChart.vue'
export { default as WOrgChart } from './organisms/data-viz/OrgChart.vue'
export { default as WOrgChartNode } from './organisms/data-viz/OrgChartNode.vue'
export { default as WTreeTable } from './organisms/data-viz/TreeTable.vue'

// ============================================
// PERFORMANCE COMPONENTS
// ============================================

export { default as WVirtualScroller } from './organisms/performance/VirtualScroller.vue'

// ============================================
// NAVIGATION COMPONENTS (Additional)
// ============================================

export { default as WSpeedDial } from './organisms/navigation/SpeedDial.vue'
export { default as WFab } from './organisms/navigation/Fab.vue'
export { default as WBottomSheet } from './organisms/navigation/BottomSheet.vue'
export { default as WSplitView } from './organisms/navigation/SplitView.vue'

// ============================================
// MOLECULES - Additional
// ============================================

// Input
export { default as WChipInput } from './molecules/ChipInput.vue'
export { default as WColorInput } from './molecules/ColorInput.vue'
export { default as WInplace } from './molecules/Inplace.vue'
export { default as WCascadeSelect } from './molecules/CascadeSelect.vue'
export { default as WToggleMask } from './molecules/ToggleMask.vue'
export { default as WAutoComplete } from './molecules/AutoComplete.vue'
export { default as WMention } from './molecules/Mention.vue'

// ============================================
// ATOMS - Additional
// ============================================

export { default as WTriStateCheckbox } from './atoms/TriStateCheckbox.vue'

// ============================================
// MEDIA - Additional
// ============================================

export { default as WSignaturePad } from './organisms/media/SignaturePad.vue'
export { default as WTerminal } from './organisms/media/Terminal.vue'

// ============================================
// NAVIGATION - Additional
// ============================================

export { default as WDock } from './organisms/navigation/Dock.vue'

// ============================================
// PERFORMANCE - Additional
// ============================================

export { default as WBlockUI } from './organisms/performance/BlockUI.vue'
export { default as WDeferredContent } from './organisms/performance/DeferredContent.vue'

// ============================================
// DATA VIZ - Additional
// ============================================

export { default as WPickList } from './organisms/data-viz/PickList.vue'
export { default as WOrderList } from './organisms/data-viz/OrderList.vue'

// ============================================
// PERFORMANCE - Additional (2)
// ============================================

export { default as WAnimateOnScroll } from './organisms/performance/AnimateOnScroll.vue'

// ============================================
// MOLECULES - Additional (2)
// ============================================

export { default as WTreeSelect } from './molecules/TreeSelect.vue'
export { default as WTreeSelectNode } from './molecules/TreeSelectNode.vue'

// ============================================
// NAVIGATION - Additional (5)
// ============================================

export { default as WContextMenu } from './organisms/navigation/ContextMenu.vue'
export { default as WMenubar } from './organisms/navigation/Menubar.vue'
export { default as WPanelMenu } from './organisms/navigation/PanelMenu.vue'
export { default as WMegaMenu } from './organisms/navigation/MegaMenu.vue'
export { default as WTieredMenu } from './organisms/navigation/TieredMenu.vue'
