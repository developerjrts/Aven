import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  formContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBarSpacer: {
    width: 42,
  },
  form: {
    paddingTop: 42,
    gap: 10
  },
  searchBar: {
    minHeight: 50,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 14,
    marginTop: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  titleInput: {
    minHeight: 56,
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    marginBottom: 26,
  },
  bodyInput: {
    minHeight: 190,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    paddingTop: 16,
    marginBottom: 26,
  },
  codeInput: {
    minHeight: 250,
    fontFamily: 'monospace',
    fontSize: 15,
    lineHeight: 22,
    paddingTop: 16,
    marginBottom: 26,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  button: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderRadius: 16,
    paddingHorizontal: 18,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  compactButton: {
    minHeight: 52,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  cardTitle: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 22,
    marginBottom: 18,
  },
  emptyTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
    letterSpacing: -0.2,
  },
  languageOptions: {
    gap: 8,
    paddingBottom: 26,
  },
  languageOption: {
    minHeight: 38,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 19,
    paddingHorizontal: 14,
  },
  languageOptionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  codeBlock: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  richEditor: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  richToolbar: {
    minHeight: 48,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    borderBottomWidth: 1,
    paddingHorizontal: 12,
  },
  richToolbarButton: {
    width: 36,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  richToolbarButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  richToolbarLabel: {
    fontSize: 18,
  },
  richToolbarItalic: {
    fontStyle: 'italic',
  },
  richToolbarUnderline: {
    textDecorationLine: 'underline',
  },
  richEditorSurface: {
    minHeight: 250,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dialogOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    paddingHorizontal: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
  },
  dialogTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
  },
  dialogMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  dialogAction: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  dialogCancelAction: {
    borderWidth: 1,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 21,
  },
});