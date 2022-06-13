/* eslint-disable @typescript-eslint/no-unused-vars */

export namespace TellMe {
  interface Block {
    data: BlockData
    /** The unique block ID. */
    id: string
    type: BlockType
    /** The value represents either the label or the Markdown source depending on the block type. */
    value: string
  }

  type BlockData = {
    /** The 0-indexed page number containing this block. */
    pageIndex: number
    /** The 0-indexed block rank on the page containing this block. */
    pageRankIndex: number
  }

  type BlockType =
    | 'action_next'
    | 'action_submit'
    | 'content_subtitle'
    | 'content_text'
    | 'input_checkbox'
    | 'input_choice'
    | 'input_email'
    | 'input_file'
    | 'input_linear_scale'
    | 'input_link'
    | 'input_long_answer'
    | 'input_multiple_choice'
    | 'input_number'
    | 'input_phone'
    | 'input_rating'
    | 'input_short_answer'
    | 'question'

  interface ActionBlock extends Block {
    type: 'action_next' | 'action_submit'
  }

  interface ContentBlock extends Block {
    type: 'content_subtitle' | 'content_text'
  }

  interface InputBlock extends Block {
    data: BlockData & {
      ifTruethyThenShowQuestionIds: string[]
    }
    type:
      | 'input_checkbox'
      | 'input_choice'
      | 'input_email'
      | 'input_file'
      | 'input_linear_scale'
      | 'input_link'
      | 'input_long_answer'
      | 'input_multiple_choice'
      | 'input_number'
      | 'input_phone'
      | 'input_rating'
      | 'input_short_answer'
  }

  interface QuestionBlock extends Block {
    data: BlockData & {
      isHidden: boolean
      isRequired: boolean
      /** The question unique key. Optional key to ease question identification (i.e.: when exposed via an API). */
      key: string | null
    }
    type: 'question'
  }

  type TreeBlock = ActionBlock | ContentBlock | InputBlock | QuestionBlock

  interface Tree {
    children: TreeBlock[]
    data: {
      /** The background URI. This can be a domain-relative path, i.e.: "/images/background.svg". */
      backgroundUri: string | null
      /** The cover URI. This can be a domain-relative path, i.e.: "/images/cover.svg". */
      coverUri: string | null
      /** The language code of the survey content as defined by IETF BCP 47 language tag. */
      language: string
      /** The logo URI. This can be a domain-relative path, i.e.: "/images/logo.svg". */
      logoUri: string | null
      /** The survey title. */
      title: string
      /** Tell Me JSON Schema version used to validate. Major versions here should match Tell Me application major versions. */
      version: '1.0.0'
    }
    /** The unique survey ID. This should match the row ID in database "surveys" table. */
    id: string
    type: 'root'
  }

  interface TreeEntry {
    children: TreeBlock[]
    data: {
      /** The background URI. This can be a domain-relative path, i.e.: "/images/background.svg". */
      backgroundUri: string | null
      /** The cover URI. This can be a domain-relative path, i.e.: "/images/cover.svg". */
      coverUri: string | null
      /** The language code of the survey content as defined by IETF BCP 47 language tag. */
      language: string
      /** The logo URI. This can be a domain-relative path, i.e.: "/images/logo.svg". */
      logoUri: string | null
      /** The survey title. */
      title: string
      /** Tell Me JSON Schema version used to validate. Major versions here should match Tell Me application major versions. */
      version: '1.0.0'
    }
    /** The unique survey ID. This should match the row ID in database "surveys" table. */
    id: string
    type: 'root'
  }

  type Question = {
    /** The original Tell Me Survey parent question block unique ID. */
    id: string
    /** The question unique key. Optional key to ease question identification (i.e.: when exposed via an API). */
    key: string | null
    value: string
  }

  interface Answer {
    data: Record<string, any>
    question: Question
    rawValue: string
    type: 'email' | 'file' | 'link' | 'phone' | 'score' | 'string' | 'strings'
  }

  interface EmailAnswer extends Answer {
    data: {
      value: string
    }
    type: 'email'
  }

  interface FileAnswer extends Answer {
    data: {
      mime: string
      uri: string
    }
    type: 'file'
  }

  interface LinkAnswer extends Answer {
    data: {
      value: string
    }
    type: 'link'
  }

  interface PhoneAnswer extends Answer {
    data: {
      value: string
    }
    type: 'phone'
  }

  interface ScoreAnswer extends Answer {
    data: {
      base: number
      value: number
    }
    type: 'score'
  }

  interface StringAnswer extends Answer {
    data: {
      isMarkdown: boolean
      value: string
    }
    type: 'string'
  }

  interface StringsAnswer extends Answer {
    data: {
      values: string[]
    }
    type: 'strings'
  }

  type DataEntryAnswer =
    | EmailAnswer
    | FileAnswer
    | LinkAnswer
    | PhoneAnswer
    | ScoreAnswer
    | StringAnswer
    | StringsAnswer

  type DataEntry = {
    answers: DataEntryAnswer[]
    id: string
    /** RFC 3339 UTC date & time */
    openedAt: string
    /** RFC 3339 UTC date & time */
    submittedAt: string
  }

  interface Data {
    entries: DataEntry[]
    /** The related survey ID. */
    id: string
    language: string
    title: string
    version: '1.0.0'
  }
}
