import React, { useState } from 'react';
import { Theme } from '../../../shared/theme/theme';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';
import { Field } from '../../../shared/ui/Field';
import { Section } from '../../../shared/ui/Section';
import { AppSnapshot } from '../../../store/models';
import { ListRow } from '../SettingsRows';
import { useTranslation } from '../../../i18n';

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
  const { t } = useTranslation();
  const [newCategory, setNewCategory] = useState('');

  return (
    <Section theme={theme} title={t('settings.categories.title')}>
      <Card theme={theme}>
        <Field
          theme={theme}
          label={t('settings.categories.newCategory')}
          value={newCategory}
          onChangeText={setNewCategory}
          placeholder={t('settings.categories.newCategoryPlaceholder')}
        />
        <Button
          theme={theme}
          label={t('settings.categories.addCategory')}
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
                label={t('common.actions.remove')}
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
