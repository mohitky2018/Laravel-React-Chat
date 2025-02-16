<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use App\Events\SocketMessage;
use App\Events\SocketMessageDelete;
use App\Events\SocketMessageUpdate;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $messages = Message::where('sender_id', Auth::id())
            ->where('receiver_id', $user->id)
            ->orWhere('sender_id', $user->id)
            ->where('receiver_id', Auth::id())
            ->latest()
            ->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function byGroup(Group $group)
    {
        $messages = Message::where('group_id', $group->id)
            ->latest()
            ->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function loadOlder(Message $message)
    {
        if ($message->group_id) {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where('group_id', $message->group_id)
                ->latest()
                ->paginate(10);
        } else {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where(function ($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id);
                })
                ->latest()
                ->paginate(10);
        }

        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $data['sender_id'] = Auth::id();
        $receiverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;

        $files = $data['attachments'] ?? [];

        $message = Message::create($data);

        // $attachments = [];
        if ($files) {
            foreach ($files as $file) {
                $directory = 'attachments/' . Str::random(32);
                Storage::makeDirectory($directory);

                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public'),
                ];

                $attachment = MessageAttachment::create($model);
                // $attachments[] = $attachment;
            }
            // $message->attachments = $attachments;
        }

        if ($receiverId) {
            Conversation::updateConversationWithMessage($receiverId, Auth::id(), $message);
        }

        if ($groupId) {
            Group::updateGroupWithMessage($groupId, $message);
        }

        SocketMessage::dispatch($message);

        return new MessageResource($message);
    }

    public function update(Message $message, Request $request)
    {
        if ($message->sender_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $message->update($request->all());

        SocketMessageUpdate::dispatch($message);

        return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
        if ($message->group_id) {
            $group = Group::where('id', $message->group_id);
            $isLastMessage = $group->where('last_message_id', $message->id)->exists();
            if ($isLastMessage) {
                $latestMessage = Message::where('group_id', $message->group_id)
                    ->orderBy('created_at', 'desc')
                    ->skip(1)
                    ->first();

                $group->update([
                    'last_message_id' => $latestMessage ? $latestMessage->id : null,
                ]);
            }
        } else {
            $userId1 = $message->sender_id;
            $userId2 = $message->receiver_id;

            $conversation = Conversation::where(function ($query) use ($userId1, $userId2) {
                $query->where('user_id1', $userId1)
                    ->where('user_id2', $userId2);
            })->orWhere(function ($query) use ($userId1, $userId2) {
                $query->where('user_id1', $userId2)
                    ->where('user_id2', $userId1);
            });

            $isLastMessage = $conversation->where('last_message_id', $message->id)->exists();

            if ($isLastMessage) {
                $latestMessage = Message::where('conversation_id', $message->conversation_id)
                    ->orderBy('created_at', 'desc')
                    ->skip(1)
                    ->first();

                $conversation->update([
                    'last_message_id' => $latestMessage ? $latestMessage->id : null,
                ]);
            }
        }

        SocketMessageDelete::dispatch($message);

        $message->delete();

        return response()->json(['message' => 'Message deleted successfully']);
    }
}
