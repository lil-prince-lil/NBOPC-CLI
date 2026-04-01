import React from 'react'
import { Box, Text, useTheme, color } from 'src/ink.js'
import type { HexColor } from '../../ink/styles.js'
import { env } from '../../utils/env.js'
import { useTerminalSize } from '../../hooks/useTerminalSize.js'
import { useMainLoopModel } from '../../hooks/useMainLoopModel.js'
import { getLogoDisplayData, truncatePath } from '../../utils/logoV2Utils.js'
import { renderModelSetting } from '../../utils/model/model.js'
import { resolveThemeSetting } from '../../utils/systemTheme.js'
import { getGlobalConfig } from '../../utils/config.js'
import { OffscreenFreeze } from '../OffscreenFreeze.js'
import { EmergencyTip } from './EmergencyTip.js'
import { NBOPCBanner } from './NBOPCBanner.js'

// Letter widths: N(10)+B(8)+O(9)+P(8)+C(8) = 43
const BANNER_WIDTH = 43

const TAGLINE = '❯ ✦ AI Community  ·  Empowered by AI  ✦'

// Brand colors for each letter of NBOPC
const LETTER_COLORS: [string, HexColor][] = [
  ['N', '#2857A4'],
  ['B', '#1EAF8E'],
  ['O', '#FFFFFF'],
  ['P', '#2857A4'],
  ['C', '#1EAF8E'],
]

function buildRainbowBorderTitle(
  version: string,
  userTheme: ReturnType<typeof resolveThemeSetting>,
): string {
  const letters = LETTER_COLORS.map(([char, hex]) =>
    color(hex, userTheme)(char),
  ).join('')
  const ver = color('inactive', userTheme)(` v${version}`)
  return ` ${letters}${ver} `
}

export function WelcomeV2(): React.ReactNode {
  const [theme] = useTheme()
  const { columns } = useTerminalSize()
  const model = useMainLoopModel()
  const modelDisplayName = renderModelSetting(model)
  const { version, cwd, billingType } = getLogoDisplayData()
  const userTheme = resolveThemeSetting(getGlobalConfig().theme)
  const truncatedCwd = truncatePath(cwd, Math.max(BANNER_WIDTH - 4, 20))

  // Apple Terminal: no full-block Unicode support, show simple colored fallback
  if (env.terminal === 'Apple_Terminal') {
    return (
      <Box flexDirection="column" paddingY={1}>
        <Box flexDirection="row">
          {LETTER_COLORS.map(([char, hex]) => (
            <Text key={char} bold color={hex}>{char}</Text>
          ))}
          <Text dimColor> v{version}</Text>
        </Box>
        <Text dimColor>{TAGLINE}</Text>
        <Text dimColor>{modelDisplayName} · {billingType}</Text>
        <Text dimColor>{truncatedCwd}</Text>
      </Box>
    )
  }

  const borderTitle = buildRainbowBorderTitle(version, userTheme)
  const separator = '─'.repeat(BANNER_WIDTH)

  return (
    <OffscreenFreeze>
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="claude"
        borderText={{ content: borderTitle, position: 'top', align: 'start', offset: 1 }}
        paddingX={2}
        paddingY={1}
      >
        {/* ── Rainbow ASCII art ── */}
        <NBOPCBanner />

        {/* ── Tagline ── */}
        <Box marginTop={1}>
          <Text dimColor>{TAGLINE}</Text>
        </Box>

        {/* ── Separator ── */}
        <Box marginTop={1} marginBottom={1}>
          <Text dimColor>{separator}</Text>
        </Box>

        {/* ── Model · Billing · Version ── */}
        <Box>
          <Text dimColor>
            {modelDisplayName}
            {' · '}
            {billingType}
            {' · '}
            v{version}
          </Text>
        </Box>

        {/* ── Current directory ── */}
        <Box>
          <Text dimColor>{truncatedCwd}</Text>
        </Box>

        {/* ── Emergency tip (shown when a new tip is available) ── */}
        <EmergencyTip />
      </Box>
    </OffscreenFreeze>
  )
}
