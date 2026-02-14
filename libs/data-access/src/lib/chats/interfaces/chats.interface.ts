import {Profile} from '../../profiles';


export interface Chat {
	id: number
	userFirst: Profile
	userSecond: Profile
	messages: Message[]
	companion?: Profile //необязательное поле
}

export interface Message {
	text: string
	id: number
	userFromId: number
	personalChatId: number
	createdAt: string
	updatedAt?: string
	isRead: boolean
	user?: Profile
	isMine?: boolean
}

export interface LastMessageRes {
	userFrom: Profile
	id: number
	message: string | null
	createdAt: string
	unreadMessages: number
}
