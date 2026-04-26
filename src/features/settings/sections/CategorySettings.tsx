import React, { useState } from 'react';
import { Theme } from '../../../shared/theme/theme';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';
import { Field } from '../../../shared/ui/Field';
import { Section } from '../../../shared/ui/Section';
import { AppSnapshot } from '../../../store/models';
import { ListRow } from '../SettingsRows';

export function CategorySettings({
  theme,
  snapshot,
  onAddExpenseCategory,
  onRemoveExpenseCategory,
}: {
  theme: Theme;
  snapshot: AppSnapshot;
  onAddExpenseCategory: (value: string) => Promise<void>;
  onRemoveExpenseCategory: (value: string) => Promise<void>;
}) {
  const [newCategory, setNewCategory] = useState('');

  return (
    <Section theme={theme} title="Expense categories">
      <Card theme={theme}>
        <Field
          theme={theme}
          label="New category"
          value={newCategory}
          onChangeText={setNewCategory}
          placeholder="Pets"
        />
        <Button
          theme={theme}
          label="Add category"
          kind="secondary"
          onPress={() => {
            onAddExpenseCategory(newCategory).catch(() => undefined);
            setNewCategory('');
          }}
        />
        {snapshot.settings.expenseCategories.map(item => (
          <ListRow
            key={item}
            theme={theme}
            title={item}
            trailing={
              <Button
                theme={theme}
                label="Remove"
                kind="danger"
                onPress={() =>
                  onRemoveExpenseCategory(item).catch(() => undefined)
                }
              />
            }
          />
        ))}
      </Card>
    </Section>
  );
}
