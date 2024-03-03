export function useNumberFieldCustomEmptyDefault({
  name,
  dynamicRule,
  initialValue,
  rule = 'required'
}: {
  dynamicRule?: Ref<string>
  initialValue?: number
  name: string
  rule?: string
}) {
  const validation = computed(() =>
    [rule, dynamicRule?.value].filter((rule) => rule).join('|')
  )

  return useField<number>(name, validation, {
    initialValue,
    validateOnValueUpdate: false
  })
}

export const useNumberFieldCustom = ({
  name,
  rule,
  initialValue
}: {
  name: string
  rule: string
  initialValue?: number
}) => {
  const initial = initialValue ? { initialValue } : {}
  return useField<number>(name, rule, {
    ...initial,
    validateOnValueUpdate: false
  })
}

export const useStringFieldCustom = ({
  name,
  rule,
  dynamicRule,
  initialValue
}: {
  name: string
  rule?: string
  dynamicRule?: Ref<string>
  initialValue?: string
}) => {
  const initial = initialValue ? { initialValue } : {}
  const validation = computed(() =>
    [rule, dynamicRule?.value].filter((rule) => rule).join('|')
  )

  return useField<string>(name, validation, {
    ...initial,
    validateOnValueUpdate: false
  })
}
