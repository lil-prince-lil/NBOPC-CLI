import * as React from 'react'
import { Box, Text } from '../../ink.js'

// ANSI Shadow style ASCII art for each letter of "NBOPC"
// 5 letters × 6 rows, rainbow colors
const BANNER_LETTERS = [
  {
    key: 'N',
    color: '#FF4444',
    rows: [
      '███╗   ██╗',
      '████╗  ██║',
      '██╔██╗ ██║',
      '██║╚██╗██║',
      '██║ ╚████║',
      '╚═╝  ╚═══╝',
    ],
  },
  {
    key: 'B',
    color: '#FF8C00',
    rows: [
      '██████╗ ',
      '██╔══██╗',
      '██████╔╝',
      '██╔══██╗',
      '██████╔╝',
      '╚═════╝ ',
    ],
  },
  {
    key: 'O',
    color: '#FFD700',
    rows: [
      ' ██████╗ ',
      '██╔═══██╗',
      '██║   ██║',
      '██║   ██║',
      '╚██████╔╝',
      ' ╚═════╝ ',
    ],
  },
  {
    key: 'P',
    color: '#44FF44',
    rows: [
      '██████╗ ',
      '██╔══██╗',
      '██████╔╝',
      '██╔═══╝ ',
      '██║     ',
      '╚═╝     ',
    ],
  },
  {
    key: 'C',
    color: '#00CCFF',
    rows: [
      ' ██████╗',
      '██╔════╝',
      '██║     ',
      '██║     ',
      '╚██████╗',
      ' ╚═════╝',
    ],
  },
]

export function NBOPCBanner(): React.ReactNode {
  return (
    <Box flexDirection="row">
      {BANNER_LETTERS.map((letter, idx) => (
        <Box key={idx} flexDirection="column">
          {letter.rows.map((row, rowIdx) => (
            <Text key={rowIdx} color={letter.color}>
              {row}
            </Text>
          ))}
        </Box>
      ))}
    </Box>
  )
}
