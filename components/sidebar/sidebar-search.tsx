import { ContentType } from "@/types"
import { FC } from "react"
import { Input } from "../ui/input"
import { contentTypeMapPluralAccusative } from "../language/config/lv-map"

interface SidebarSearchProps {
  contentType: ContentType
  searchTerm: string
  setSearchTerm: Function
}

export const SidebarSearch: FC<SidebarSearchProps> = ({
  contentType,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <Input
      placeholder={`Meklēt ${
        contentTypeMapPluralAccusative[contentType] || contentType
      }...`}
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />
  )
}
