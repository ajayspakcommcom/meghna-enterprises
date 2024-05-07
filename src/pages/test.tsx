import React, { useState } from 'react';

interface Field {
    property: string;
    value: string;
}

const Index: React.FC = () => {

    const [fields, setFields] = useState<Field[]>([]);
    const [submittedValues, setSubmittedValues] = useState<Field[]>([]);

    const handleAddField = () => {
        setFields([...fields, { property: '', value: '' }]);
    };

    const handleRemoveField = (index: number) => {
        const updatedFields = [...fields];
        updatedFields.splice(index, 1);
        setFields(updatedFields);
    };

    const handleInputChange = (index: number, type: keyof Field, value: string) => {
        const updatedFields = [...fields];
        updatedFields[index][type] = value;
        setFields(updatedFields);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setSubmittedValues(fields);

        const transformedData: { [key: string]: string } = fields.reduce((acc: any, obj: any) => {
            acc[obj.property.trim()] = obj.value.trim();
            return acc;
        }, {});
    };

    return (
        <>
            <div>
                <button onClick={handleAddField}>Add Field</button>
                <form onSubmit={handleSubmit}>
                    {fields.map((field, index) => (
                        <div key={index}>

                            <input
                                type="text"
                                value={field.property}
                                placeholder="Property"
                                onChange={(e) => handleInputChange(index, 'property', e.target.value)}
                            />

                            <textarea
                                value={field.value}
                                placeholder="Value"
                                onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                            />

                            <button type="button" onClick={() => handleRemoveField(index)}>Remove</button>

                        </div>
                    ))}
                    <button type="submit">Submit</button>
                </form>
                <div>
                    <ul>
                        {submittedValues.map((field, index) => (
                            <li key={index}>
                                {field.property}: {field.value}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Index;
