import { TaskEditPayload, TaskObject, TaskStatus } from "@/lib/definitions"
import { cn, DateFormatter } from "@/lib/utils";
import { useState, KeyboardEvent, useEffect, FormEvent, FocusEvent } from "react"

interface EditableProps {
  selectedTask: TaskObject;
  handleSave: (task: TaskObject, payload: TaskEditPayload) => void
}

export default function EditableTask (props: EditableProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isEditing, setEditing] = useState({ title: false, content: false }); 

  // Handle save on Enter key press
  const handleKeyDownTitle = (e: KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key === "Enter") {
      e.preventDefault() // Prevents a new line from being added in the content
      if(isEditing.title){
        setTitle(e.currentTarget.textContent || '');
        setEditing({
          title: false,
          content: false
        })
        e.currentTarget.blur();
      }
    }
  }

  const handleKeyDownContent = (e: KeyboardEvent<HTMLParagraphElement>) => {
    if (e.key === "Enter") {
      e.preventDefault() // Prevents a new line from being added in the content
      if(isEditing.content){
        setContent(e.currentTarget.textContent || '');
        setEditing({
          title: false,
          content: false
        })
        e.currentTarget.blur();
      }
    }
  }

  const handleFocusTitle = (e: FocusEvent<HTMLHeadingElement>) => {
    setEditing({
      title: true,
      content: false
    })
    e.preventDefault();
  }
  const handleFocusContent = (e: FocusEvent<HTMLParagraphElement>) => {
    setEditing({
      title: false,
      content: true
    })
    e.preventDefault();
  }

  const handleBlurTitle = (e: FocusEvent<HTMLHeadingElement>) => {
    if(isEditing.title){
      setTitle(e.currentTarget.textContent || '');
      setEditing({
        title: false,
        content: false
      })
    }
  }
  const handleBlurContent = (e: FocusEvent<HTMLParagraphElement>) => {
    if(isEditing.content){
      setContent(e.currentTarget.textContent || '');
      setEditing({
        title: false,
        content: false
      })
    }
  }

  useEffect(()=>{
    setTitle(props.selectedTask.title);
    setContent(props.selectedTask.content);
  }, [])

  useEffect(()=>{
    if(!isEditing.title){
      if(title && props.selectedTask.title != title){
        props.handleSave(props.selectedTask, {
          title,
          content
        });
      }
    }
    if(!isEditing.content){
      if(content && props.selectedTask.content != content){
        props.handleSave(props.selectedTask, {
          title,
          content
        });
      }
    }
  }, [title, content])

  return (
    <div>
      <span className="inline sm:hidden text-sm text-muted-foreground">
        {DateFormatter.format(props.selectedTask.updatedAt, 'MMM d, yyyy')}
      </span>
      <h2
        contentEditable
        className={cn("text-2xl font-bold mb-2", props.selectedTask.status === TaskStatus.COMPLETED && "text-muted-foreground line-through")}
        suppressContentEditableWarning
        onFocus={(e)=>handleFocusTitle(e)}
        onBlur={(e) => handleBlurTitle(e)}
        onKeyDown={(e) => handleKeyDownTitle(e)}
      >
        {title}
      </h2>
      <p
        contentEditable
        className="mb-2"
        suppressContentEditableWarning
        onFocus={(e)=>handleFocusContent(e)}
        onBlur={(e) => handleBlurContent(e)}
        onKeyDown={(e) => handleKeyDownContent(e)}
      >
        {content}
      </p>
    </div>
  )
}
