# Shared Components Library

This document provides an overview of the shared components available in the MediLabX application.

## Table of Contents

1. [Introduction](#introduction)
2. [Components Overview](#components-overview)
3. [How to Use](#how-to-use)
4. [Component Reference](#component-reference)
   - [Modal](#modal)
   - [DataTable](#datatable)
   - [FormField](#formfield)
   - [ConfirmationDialog](#confirmationdialog)
   - [Alert](#alert)
5. [Examples](#examples)

## Introduction

These shared components were created to bring consistency to the UI across the MediLabX application. By using these components, we ensure:
- Consistent styling and behavior
- Faster development
- Easier maintenance
- Better user experience

## Components Overview

The shared components library includes:

- **Modal**: A versatile modal dialog with customizable headers, footers, and content.
- **DataTable**: A table component for displaying data with sorting, actions, and empty state handling.
- **FormField**: A standardized form input component supporting various input types with validation.
- **ConfirmationDialog**: A dialog for confirming user actions with customizable messages.
- **Alert**: A component for displaying notifications and messages.

## How to Use

To use these components in your files, import them from the common directory:

```jsx
import { 
  Modal, 
  ModalFooter, 
  DataTable, 
  DataTableHelpers, 
  FormField, 
  ConfirmationDialog,
  Alert
} from '../components/common';
```

## Component Reference

### Modal

A flexible modal dialog component.

```jsx
<Modal
  isOpen={boolean}
  onClose={function}
  title="Modal Title"
  icon={<IconComponent />}
  headerBgClass="bg-gradient-to-r from-indigo-700 to-indigo-500"
  footer={<FooterContent />}
  size="md"
  loading={false}
>
  Modal content goes here...
</Modal>
```

**Props:**
- `isOpen` (boolean): Controls visibility of the modal
- `onClose` (function): Function called when closing the modal
- `title` (string): Title text displayed in the header
- `icon` (React element): Icon displayed next to title
- `headerBgClass` (string): CSS class for header background
- `footer` (React element): Footer content with action buttons
- `size` (string): 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', 'full'
- `loading` (boolean): Shows loading spinner when true

**Footer Buttons:**

```jsx
<Modal
  // ... other props
  footer={
    <>
      <ModalFooter.CancelButton onClick={handleCancel} label="Cancel" />
      <ModalFooter.SubmitButton onClick={handleSubmit} label="Save" isLoading={loading} />
      <ModalFooter.DeleteButton onClick={handleDelete} label="Delete" isLoading={loading} />
    </>
  }
>
  // Modal content
</Modal>
```

### DataTable

A table component for displaying and interacting with data.

```jsx
<DataTable
  columns={[
    { header: 'Name', accessor: 'name', className: 'font-medium' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (item) => <DataTableHelpers.Badge text={item.status} type="success" />
    },
    {
      header: 'Actions',
      render: (item) => (
        <DataTableHelpers.Actions
          actions={[
            {
              icon: <FaEdit />,
              type: 'primary',
              label: 'Edit',
              onClick: (item) => handleEdit(item)
            },
            {
              icon: <FaTrash />,
              type: 'danger',
              label: 'Delete',
              onClick: (item) => handleDelete(item),
              shouldShow: (item) => !item.isProtected
            }
          ]}
          item={item}
        />
      )
    }
  ]}
  data={dataArray}
  loading={isLoading}
  emptyMessage="No data available"
  onRowClick={(item) => handleRowClick(item)}
/>
```

**Props:**
- `columns` (array): Column definitions with headers and cell renderers
- `data` (array): Array of data objects
- `loading` (boolean): Shows loading indicator when true
- `emptyMessage` (string): Message shown when data is empty
- `onRowClick` (function): Called when a row is clicked

**Helpers:**

1. **Badge**: `<DataTableHelpers.Badge text="Active" type="success" />`
   - Types: 'primary', 'success', 'warning', 'danger', 'info', 'gray'

2. **Actions**: Button group for row actions
   ```jsx
   <DataTableHelpers.Actions
     actions={[
       {
         icon: <FaIcon />,
         type: 'primary',
         label: 'Action tooltip',
         onClick: (item) => handleAction(item),
         shouldShow: (item) => condition // Optional
       }
     ]}
     item={rowData}
   />
   ```

### FormField

A standardized form field component with built-in validation.

```jsx
<FormField
  id="email"
  name="email"
  label="Email Address"
  type="email"
  value={formData.email}
  onChange={handleChange}
  error={formErrors.email}
  icon={<FaEnvelope className="text-gray-400" />}
  placeholder="Enter your email"
  required
/>
```

**Props:**
- `id` (string): HTML ID attribute for the input
- `name` (string): Form field name
- `label` (string): Field label
- `type` (string): Input type ('text', 'email', 'password', 'select', 'textarea', etc.)
- `value` (any): Current input value
- `onChange` (function): Change handler function
- `error` (string): Error message if validation fails
- `icon` (React element): Optional icon displayed in the input
- `placeholder` (string): Placeholder text
- `options` (array): For select inputs, array of options
- `required` (boolean): Whether the field is required

### ConfirmationDialog

A dialog for confirming important actions.

```jsx
<ConfirmationDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDeleteItem}
  title="Confirm Deletion"
  message="Are you sure you want to delete this item?"
  description="This action cannot be undone."
  type="danger"
  confirmText="Delete"
  cancelText="Cancel"
  loading={isDeleting}
/>
```

**Props:**
- `isOpen` (boolean): Controls dialog visibility
- `onClose` (function): Called when dialog is closed
- `onConfirm` (function): Called when action is confirmed
- `title` (string): Dialog title
- `message` (string): Main confirmation message
- `description` (string): Additional descriptive text
- `type` (string): 'danger', 'warning', 'info'
- `confirmText` (string): Text for confirm button
- `cancelText` (string): Text for cancel button
- `loading` (boolean): Shows loading state on confirm button

### Alert

A component for displaying notifications and feedback messages.

```jsx
<Alert
  type="error"
  title="Failed to save changes"
  message="Please check your network connection and try again."
  onDismiss={() => setError(null)}
/>
```

**Props:**
- `type` (string): 'error', 'warning', 'info', 'success'
- `title` (string): Main alert message
- `message` (string): Additional description text
- `onDismiss` (function): Called when alert is dismissed

## Examples

### Staff Management

```jsx
// Import shared components
import { 
  DataTable, 
  DataTableHelpers, 
  Modal, 
  ModalFooter,
  FormField,
  ConfirmationDialog,
  Alert
} from '../../components/common';

// Inside your component
const YourComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  
  // Columns definition
  const columns = [
    { header: 'Name', accessor: 'name' },
    { 
      header: 'Status', 
      render: (item) => (
        <DataTableHelpers.Badge 
          text={item.status} 
          type={item.status === 'Active' ? 'success' : 'warning'} 
        />
      )
    },
    // More columns...
  ];
  
  return (
    <div>
      {error && (
        <Alert 
          type="error"
          title={error}
          onDismiss={() => setError(null)}
        />
      )}
      
      <DataTable 
        columns={columns}
        data={yourData}
        loading={isLoading}
      />
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Item"
        footer={
          <>
            <ModalFooter.CancelButton onClick={() => setShowModal(false)} />
            <ModalFooter.SubmitButton onClick={handleSubmit} />
          </>
        }
      >
        <form>
          <FormField
            id="name"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            error={formErrors.name}
          />
          {/* More form fields... */}
        </form>
      </Modal>
    </div>
  );
};
```

With these components, you can quickly build consistent and beautiful UIs across the entire MediLabX application.
